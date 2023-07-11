import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { request } from 'undici';
import { tiktokSchema } from './tiktokSchema';
import { z } from 'zod';
import { AttachmentBuilder, WebhookClient } from 'discord.js';
import { env } from './env';
import { writeFile } from 'fs/promises';

@Injectable()
export class AppService {

  webhook: WebhookClient;

  constructor(
    private prisma: PrismaService,
  ) {
    this.webhook = new WebhookClient({
      url: env.DISCORD_WEBHOOK_URL,
    });
  }

  async scrapePost(id: string) {
    const {
      data,
      res: { headers },
    } = await this.tryFetchPost(id);
    const [postId, item] = Object.entries(data.ItemModule).at(0) || [];
    const [name, author] = Object.entries(data.UserModule.users).at(0) || [];
    if (!postId || !item || !author)
      return;

    await Promise.all([
      this.#handleTikTokPostUpdate({
        id: postId,
        description: item.desc,
        authorId: item.authorId,
        commentCount: BigInt(item.stats.commentCount),
        shareCount: BigInt(item.stats.shareCount),
        heartCount: BigInt(item.stats.diggCount),
      }),
      this.#handleTikTokUserUpdate({
        id: item.authorId,
        nickname: item.nickname,
        name: item.author,
      }),
      this.#ensureAvatarImageUpdated(item.authorId, author.avatarMedium),
      this.#ensureVideoUpdated({
        postId,
        authorId: item.authorId,
        video: {
          url: item.video.downloadAddr,
          height: item.video.height,
          width: item.video.width,
          coverUrl: item.video.originCover,
        },
        cookies: typeof headers['set-cookie'] === 'string'
          ? [<string>headers['set-cookie']]
          : <string[]>headers['set-cookie'] ?? [],
      }),
    ]);
  }

  async tryFetchPost(id: string) {
    for (let retryCount = 0; retryCount < 16; ++retryCount) {
      const res = await request(`https://www.tiktok.com/@/video/${id}`, { maxRedirections: 1 });
      const html = await res.body.text();
      const data = JSON.parse(
        html.match(/(?<=SIGI_STATE[^>]+>)[^]+?(?=<\/script>)/)?.at(0)
        ?? 'null'
      ) as z.infer<typeof tiktokSchema> | null;
      if (data)
        return {
          res,
          data,
        };
      await new Promise(rs => setTimeout(rs, 1_000));
    }
    throw new Error(`Unable to extract info`);
  }

  async #ensureVideoUpdated(data: {
    postId: string,
    authorId: string,
    video: {
      url: string,
      height: number,
      width: number,
      coverUrl: string,
    },
    cookies: string[],
  }) {
    const newHash = data.video.url.replace(/\/?\?[^]*/, '').replace(/^[^]*\//, '');
    const shouldUpdate = await this.prisma.tikTokPost.findUnique({
      where: { id: data.postId },
      select: { videoHash: true },
    }).then(user => {
      if (!user)
        return true;
      if (user.videoHash !== newHash)
        return true;
      return false;
    });
    if (!shouldUpdate)
      return;
    const [videoUrl, videoCoverUrl] = await Promise.all([
      this.#uploadFile(
        data.video.url,
        `${data.authorId}.${data.postId}.${newHash}.mp4`,
        {
          cookie: data.cookies.find(text => text.indexOf('tt_chain_token') !== -1)!.split(';').at(0)!,
          Referer: "https://www.tiktok.com/",
        },
      ),
      this.#uploadFile(
        data.video.coverUrl,
        `${data.authorId}.${data.postId}.${newHash}.jpg`,
      ),
    ]);
    await this.#handleTikTokPostUpdate({
      id: data.postId,
      authorId: data.authorId,
      videoUrl: videoUrl,
      videoHash: newHash,
      videoHeight: data.video.height,
      videoWidth: data.video.width,
      videoCover: videoCoverUrl,
    });
  }

  async #ensureAvatarImageUpdated(id: string, url: string) {
    const newHash = url.replace(/~[^]*$/, '').replace(/^[^]*\//, '');
    const shouldUpdate = await this.prisma.tikTokUser.findUnique({
      where: { id },
      select: { avatarHash: true },
    }).then(user => {
      if (!user)
        return true;
      if (user.avatarHash !== newHash)
        return true;
      return false;
    });
    if (!shouldUpdate)
      return;
    const newUrl = await this.#uploadFile(url, `${id}.${newHash}.jpg`);
    await this.#handleTikTokUserUpdate({
      id,
      avatarHash: newHash,
      avatarUrl: newUrl,
    });
  }

  async #uploadFile(url: string, name: string, headers?: Record<string, string>) {
    const {
      body,
      statusCode,
    } = await request(url, { headers });
    if (statusCode !== 200)
      throw new Error(`Got statusCode: ${statusCode}, not proceeding`);
    const msg = await this.webhook.send({
      files: [
        new AttachmentBuilder(body, { name }),
      ],
    });
    return msg.attachments.at(0)!.url;
  }

  async #handleTikTokPostUpdate(
    data: {
      id: string,
      authorId?: string,
      videoHash?: string,
      videoUrl?: string,
      heartCount?: bigint,
      shareCount?: bigint,
      commentCount?: bigint,
      description?: string,
      videoCover?: string,
      videoWidth?: number,
      videoHeight?: number,
    },
    fetchedAt = new Date,
  ) {
    const fields = {
      ...data,
      authorId: undefined,
      author: !data.authorId ? undefined : {
        connectOrCreate: {
          create: { id: data.authorId },
          where: { id: data.authorId },
        },
      },
      i_fetchedAt: fetchedAt,
    };
    await prismaUpsertRetry(this.prisma.tikTokPost, {
      where: { id: data.id },
      create: fields,
      update: fields,
    });
  }

  async #handleTikTokUserUpdate(
    data: {
      id: string,
      avatarUrl?: string,
      avatarHash?: string,
      name?: string,
      nickname?: string,
    },
    fetchedAt = new Date,
  ) {
    const fields = {
      ...data,
      i_fetchedAt: fetchedAt,
    };
    await prismaUpsertRetry(this.prisma.tikTokUser, {
      where: { id: data.id },
      create: fields,
      update: fields,
    });
  }

}

async function prismaUpsertRetry<
  T extends {
    upsert: (...args: unknown[]) => Promise<unknown>,
  },
>(model: T, ...args: Parameters<T['upsert']>): Promise<Awaited<ReturnType<T['upsert']>>> {
  while (true) {
    const result = await model.upsert(...args)
      .catch((err: Error) => err);
    if (
      result instanceof Error
      && 'code' in result
      && typeof result.code === 'string'
      && [ // https://www.prisma.io/docs/reference/api-reference/error-reference
        'P2002', // "Unique constraint failed on the {constraint}"
        'P2003', // "Foreign key constraint failed on the field: {field_name}"
        'P2024', // "A constraint failed on the database: {database_error}"
      ].indexOf(result.code) !== -1
    ) continue;
    if (result instanceof Error)
      throw result;
    return result as Awaited<ReturnType<T['upsert']>>;
  }
}
