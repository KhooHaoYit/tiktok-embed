import { fetchTikTokPost, getTikTokPost } from '@/backend';
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
          content={`0; URL=https://www.tiktok.com/@${props.post.author.name}/video/${props.post.id}`}
        />
        <meta
          property="og:image"
          content={props.post.videoCover}
        />
        <meta
          property="og:type"
          content="video.other"
        />
        <meta
          property="og:video:url"
          content={props.post.videoUrl}
        />
        <meta
          property="og:video:width"
          content={props.post.videoWidth + ''}
        />
        <meta
          property="og:video:height"
          content={props.post.videoHeight + ''}
        />
      </Head>
    </>
  )
}

export const getServerSideProps = async function (context) {
  const postId = context.query.id as string;
  const result = await getTikTokPost(postId)
    || await fetchTikTokPost(postId);
  if (!result)
    throw new Error(`Unable to fetch postId: ${postId}`);
  return {
    props: {
      post: result,
    },
  };
} satisfies GetServerSideProps;
