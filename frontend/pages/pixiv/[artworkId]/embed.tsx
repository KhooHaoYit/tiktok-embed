import { RenderEmbedder } from '@/embedder/providers';
import { pixivEmbedEmbedder } from '@/embedder/providers/pixiv';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';

export default function Page(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Head>
      <RenderEmbedder data={props.embedder} />
    </Head>
  );
}

export const getServerSideProps = async function (context) {
  const artworkId = context.query.artworkId as string;
  const result = await pixivEmbedEmbedder({
    artworkId,
    host: context.req.headers.host!,
  });
  return {
    props: {
      embedder: result,
    },
  };
} satisfies GetServerSideProps;
