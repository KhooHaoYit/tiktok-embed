import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { request } from 'undici';
import { Data, Post, getAttachments, getAuthorInfo, getPostInfo } from './tiktokSchema';
import { AttachmentBuilder, WebhookClient } from 'discord.js';
import { env } from './env';
import { upload } from './attachmentUploader';

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
    await Promise.all([
      this.#handleUser(data),
      this.#handlePost(data),
      this.#handleAttachments(
        data,
        typeof headers['set-cookie'] === 'string'
          ? [<string>headers['set-cookie']]
          : <string[]>headers['set-cookie'] ?? []
      ),
    ]);
  }

  async #handleAttachments(data: Data, cookies: string[]) {
    const attachments = getAttachments(data);
    const newAttachment = await this.prisma.attachment.findMany({
      where: {
        id: {
          in: attachments.map(attachment => attachment.id),
        },
      },
      select: { id: true },
    }).then(result =>
      attachments.filter(attachment =>
        !result.find(item => item.id === attachment.id)
      )
    );
    await Promise.all(newAttachment.map(async attachment => {
      const [imageUrl, videoUrl] = await Promise.all([
        this.#uploadFile(attachment.imageUrl, attachment.imageFilename),
        !attachment.videoUrl
          ? undefined
          : this.#uploadFile(
            attachment.videoUrl, attachment.videoFilename!,
            {
              cookie: cookies.find(text => text.indexOf('tt_chain_token') !== -1)!.split(';')[0],
              Referer: "https://www.tiktok.com/",
            },
          ),
      ]);
      await this.prisma.attachment.create({
        data: {
          id: attachment.id,
          width: attachment.width,
          height: attachment.height,
          imageUrl,
          videoUrl,
        }
      });
    }));
  }

  async #handlePost(data: Data) {
    const post = getPostInfo(data);
    const author = getAuthorInfo(data);
    const attachmentIds = getAttachments(data).map(a => a.id);
    await prismaUpsertRetry(this.prisma.post, {
      where: { id: post.id },
      update: {
        description: post.description,
        likes: post.likes,
        shares: post.shares,
        comments: post.comments,
        attachmentIds,
        author: {
          connectOrCreate: {
            where: { id: author.id },
            create: { id: author.id },
          }
        },
      },
      create: {
        id: post.id,
        description: post.description,
        likes: post.likes,
        shares: post.shares,
        comments: post.comments,
        attachmentIds,
        author: {
          connectOrCreate: {
            where: { id: author.id },
            create: { id: author.id },
          }
        },
      },
    });
  }

  async #handleUser(data: Data) {
    const user = getAuthorInfo(data);
    const avatarUrl = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { avatarUrl: true },
    }).then(async u => {
      const newFilename = user.avatarUrl.match(/(?<=\/)[^/?]+(?=\?)/)![0].replace(/~[^.]+/, '');
      const oldFilename = u?.avatarUrl?.split('/').at(-1);
      if (newFilename === oldFilename)
        return;
      return await this.#uploadFile(user.avatarUrl, newFilename);
    });
    await prismaUpsertRetry(this.prisma.user, {
      where: { id: user.id },
      update: {
        handle: user.handle,
        username: user.username,
        avatarUrl,
      },
      create: {
        id: user.id,
        handle: user.handle,
        username: user.username,
        avatarUrl,
      },
    });
  }

  async tryFetchPost(id: string) {
    for (
      let retryCount = 0
      ; retryCount < 16
      ; (
        ++retryCount,
        await new Promise(rs => setTimeout(rs, 1_000))
      )
    ) {
      const res = await request(`https://www.tiktok.com/@/video/${id}`, { maxRedirections: 1 });
      const html = await res.body.text();
      if (res.statusCode !== 200)
        continue;
      const data = JSON.parse(
        html.match(/(?<=SIGI_STATE[^>]+>)[^]+?(?=<\/script>)/)?.at(0)
        ?? 'null'
      ) as Data | null;
      if (!data)
        continue;
      return {
        res,
        data,
      };
    }
    throw new Error(`Unable to extract info`);
  }

  async #uploadFile(url: string, filename: string, headers?: Record<string, string>) {
    const {
      body,
      statusCode,
      headers: receivedHeaders,
    } = await request(url, { headers });
    if (statusCode !== 200)
      throw new Error(`Got statusCode: ${statusCode}, not proceeding`);
    const size = +<string>receivedHeaders['content-length'];
    if (Number.isNaN(size))
      throw new Error(`Undefined size`);
    const attachment = await upload(body, filename, size);
    return attachment.url;
  }

}

async function prismaUpsertRetry<
  T extends {
    upsert: (...args: unknown[]) => Promise<unknown>,
  },
>(model: T, args: Parameters<T['upsert']>[0], amount = 2): Promise<Awaited<ReturnType<T['upsert']>>> {
  let err: Error | null = null;
  for (; amount; --amount) {
    const result = await model.upsert(args)
      .catch((err: Error) => err);
    // if (
    //   result instanceof Error
    //   && 'code' in result
    //   && typeof result.code === 'string'
    //   && [ // https://www.prisma.io/docs/reference/api-reference/error-reference
    //     'P2002', // "Unique constraint failed on the {constraint}"
    //     'P2003', // "Foreign key constraint failed on the field: {field_name}"
    //     'P2024', // "A constraint failed on the database: {database_error}"
    //   ].indexOf(result.code) !== -1
    // ) continue;
    if (result instanceof Error) {
      err = result;
      continue;
    }
    return result as Awaited<ReturnType<T['upsert']>>;
  }
  if (err)
    throw err;
  throw new Error(`Exceeded retry count`);
}
