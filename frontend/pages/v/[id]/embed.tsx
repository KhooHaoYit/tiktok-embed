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
        <meta property="theme-color" content="#fe2c55" />
        <meta property="og:image" content={props.post.author.avatarUrl} />
        <meta
          property="og:title"
          content={`${props.post.author.nickname} (@${props.post.author.name})`}
        />
        <meta
          property="og:description"
          content={props.post.description}
        />
        <link
          rel="alternate"
          href={`https://${props.host}/v/${props.post.id}/oembed`}
          type="application/json+oembed"
        />
      </Head>
    </>
  );
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
      host: context.req.headers.host,
    },
  };
} satisfies GetServerSideProps;
