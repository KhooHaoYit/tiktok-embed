import { tiktokAttachmentEmbedder } from '@/embedder/providers/tiktok';
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
      <meta
        property="og:image"
        content={props.embedder.video?.imageUrl ?? props.embedder.image?.url}
      />
      {props.embedder.image ? (
        <>
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            property="og:image:width"
            content={props.embedder.image.width + ''}
          />
          <meta
            property="og:image:height"
            content={props.embedder.image.height + ''}
          />
        </>
      ) : (
        <>
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
        </>
      )}
    </Head>
  );
}

export const getServerSideProps = async function (context) {
  const postId = context.query.postId as string;
  const index = +(context.query.index as string);
  const result = await tiktokAttachmentEmbedder(postId, index);
  return {
    props: {
      embedder: result,
    },
  };
} satisfies GetServerSideProps;
