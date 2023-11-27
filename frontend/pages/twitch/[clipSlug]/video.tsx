import { RenderEmbedder } from '@/embedder/providers';
import { twitchAttachmentEmbedder } from '@/embedder/providers/twitch';
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
  const result = await twitchAttachmentEmbedder({
    clipSlug,
  });
  return {
    props: {
      embedder: result,
    },
  };
} satisfies GetServerSideProps;
