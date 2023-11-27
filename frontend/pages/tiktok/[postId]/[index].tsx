import { RenderEmbedder } from '@/embedder/providers';
import { tiktokAttachmentEmbedder } from '@/embedder/providers/tiktok';
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
  const index = +(context.query.index as string);
  const result = await tiktokAttachmentEmbedder({ postId, index });
  return {
    props: {
      embedder: result,
    },
  };
} satisfies GetServerSideProps;
