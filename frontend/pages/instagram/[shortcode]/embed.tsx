import { instagramEmbedEmbedder } from '@/embedder/providers/instagram';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';

export default function Page(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Head>
      <meta
        httpEquiv="Refresh"
        content={`0; URL=${props.embedder.redirectUrl}`}
      />
      <meta property="theme-color" content={props.embedder.embed.color} />
      <meta property="og:image" content={props.embedder.embed.thumbnailUrl} />
      <meta
        property="og:title"
        content={props.embedder.embed.title}
      />
      <meta
        property="og:description"
        content={props.embedder.embed.description}
      />
      <link
        rel="alternate"
        href={`https://${props.host}/api/oembed?type=instagram&shortcode=${props.shortcode}`}
        type="application/json+oembed"
      />
    </Head>
  );
}

export const getServerSideProps = async function (context) {
  const shortcode = context.query.shortcode as string;
  const result = await instagramEmbedEmbedder(shortcode);
  return {
    props: {
      shortcode,
      embedder: result,
      host: context.req.headers.host,
    },
  };
} satisfies GetServerSideProps;
