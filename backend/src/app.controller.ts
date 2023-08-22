import { PrismaService } from 'nestjs-prisma';
import { AppService } from './app.service';
import {
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';

@Controller()
export class AppController {

  constructor(
    private service: AppService,
    private prisma: PrismaService,
  ) { }

  @Get('/posts/:id')
  async getPost(
    @Param('id') id: string,
    @Query() {
      includeAuthor,
      includeAttachments,
    }: Record<'includeAuthor' | 'includeAttachments', string>,
  ) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { author: !!includeAuthor },
    });
    if (!post)
      return JSON.stringify(null);
    const attachments = includeAttachments
      ? await this.prisma.attachment.findMany({
        where: {
          id: { in: post.attachmentIds },
        }
      }).then(attachments =>
        Object.fromEntries(
          attachments.map(attachment => [attachment.id, attachment])
        )
      )
      : undefined;
    return JSON.stringify({
      ...post,
      attachments,
    });
  }

  @Post('/posts/:id/fetch')
  async fetchPost(
    @Param('id') id: string,
    @Query() includes: Record<'includeAuthor' | 'includeAttachments', string>,
  ) {
    await this.service.scrapePost(id);
    return await this.getPost(id, includes);
  }

}
