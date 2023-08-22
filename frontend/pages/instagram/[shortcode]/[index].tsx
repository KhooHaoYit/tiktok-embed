import { instagramAttachmentEmbedder } from '@/embedder/providers/instagram';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';

export default function Page(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <meta
          httpEquiv="Refresh"
          content={`0; URL=${props.embedder.redirectUrl}`}
        />
        <meta
          property="og:image"
          content={props.embedder.video.imageUrl}
        />
        <meta
          property="og:type"
          content="video.other"
        />
        <meta
          property="og:video:url"
          content={props.embedder.video.videoUrl}
        />
        <meta
          property="og:video:width"
          content={props.embedder.video.width + ''}
        />
        <meta
          property="og:video:height"
          content={props.embedder.video.height + ''}
        />
      </Head>
    </>
  );
}

export const getServerSideProps = async function (context) {
  const shortcode = context.query.shortcode as string;
  const index = +(context.query.index as string);
  const result = await instagramAttachmentEmbedder(shortcode, index);
  if (result.image)
    return {
      redirect: {
        destination: result.image.url,
        permanent: false,
      },
    };
  return {
    props: {
      embedder: result,
    },
  };
} satisfies GetServerSideProps;
