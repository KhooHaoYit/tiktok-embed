import { RenderEmbedder } from '@/embedder/providers';
import { tiktokEmbedEmbedder } from '@/embedder/providers/tiktok';
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
  const postId = context.query.postId as string;
  const result = await tiktokEmbedEmbedder({
    postId,
    host: context.req.headers.host!,
  });
  return {
    props: {
      embedder: result,
    },
  };
} satisfies GetServerSideProps;
