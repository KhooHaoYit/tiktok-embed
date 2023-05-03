import { PrismaService } from 'nestjs-prisma';
import { AppService } from './app.service';
import { Controller, Get, Param, Post } from '@nestjs/common';

@Controller()
export class AppController {

  constructor(
    private service: AppService,
    private prisma: PrismaService,
  ) { }

  @Get('/tikTokPost/:id')
  async getPost(
    @Param('id') id: string,
  ) {
    return await this.prisma.tikTokPost.findUnique({
      where: { id },
      include: { author: true },
    }).then(stringify);
  }

  @Post('/tikTokPost/:id/fetch')
  async fetchPost(
    @Param('id') id: string,
  ) {
    await this.service.scrapePost(id);
    return await this.getPost(id);
  }

}

function stringify(data: unknown) {
  return JSON.stringify(data, (key, value) => {
    if (typeof value === 'bigint')
      return value.toString();
    return value;
  });
}
