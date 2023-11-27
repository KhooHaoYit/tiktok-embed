import { RenderEmbedder } from '@/embedder/providers';
import { instagramEmbedEmbedder } from '@/embedder/providers/instagram';
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
  const shortcode = context.query.shortcode as string;
  const result = await instagramEmbedEmbedder({
    shortcode,
    host: context.req.headers.host!,
  });
  return {
    props: {
      embedder: result,
    },
  };
} satisfies GetServerSideProps;
