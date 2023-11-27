import { RenderEmbedder } from '@/embedder/providers';
import { instagramAttachmentEmbedder } from '@/embedder/providers/instagram';
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
  const index = +(context.query.index as string);
  const result = await instagramAttachmentEmbedder({
    shortcode, index,
  });
  return {
    props: {
      embedder: result,
    },
  };
} satisfies GetServerSideProps;
