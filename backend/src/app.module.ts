import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from 'nestjs-prisma';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { AppService } from './app.service';

@Module({
  imports: [
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   autoSchemaFile: true || './prisma/schema.graphql',
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
