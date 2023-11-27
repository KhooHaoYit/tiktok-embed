import { RenderEmbedder } from '@/embedder/providers';
import { twitchEmbedEmbedder } from '@/embedder/providers/twitch';
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
  const clipSlug = context.query.clipSlug as string;
  const result = await twitchEmbedEmbedder({
    clipSlug,
    host: context.req.headers.host!,
  });
  return {
    props: {
      embedder: result,
    },
  };
} satisfies GetServerSideProps;
