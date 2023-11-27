export interface DiscordEmbedder {
  (...args: any[]): Promise<Video | Image | Embed>;
};

type Embed = {
  redirectUrl: string
  embed: {
    color: string
    thumbnailUrl: string
    providerName: string
    authorName: string
    authorUrl: string
    title: string
    description: string
    oembedUrl: string
  }
};

type Video = {
  redirectUrl: string
  video: {
    imageUrl: string
    videoUrl: string
    width: number
    height: number
  }
};

type Image = {
  redirectUrl: string
  image: {
    url: string
    width: number
    height: number
  }
};

export function RenderEmbedder(props: { data: Awaited<ReturnType<DiscordEmbedder>> }) {
  if ('image' in props.data)
    return (
      <>
        <meta
          httpEquiv="Refresh"
          content={`0; URL=${props.data.redirectUrl}`}
        />
        <meta
          property="og:image"
          content={props.data.image?.url}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="og:image:width"
          content={props.data.image.width + ''}
        />
        <meta
          property="og:image:height"
          content={props.data.image.height + ''}
        />
      </>
    );
  if ('video' in props.data)
    return (
      <>
        <meta
          httpEquiv="Refresh"
          content={`0; URL=${props.data.redirectUrl}`}
        />
        <meta
          property="og:image"
          content={props.data.video?.imageUrl}
        />
        <meta
          property="og:type"
          content="video.other"
        />
        <meta
          property="og:video:url"
          content={props.data.video.videoUrl}
        />
        <meta
          property="og:video:width"
          content={props.data.video.width + ''}
        />
        <meta
          property="og:video:height"
          content={props.data.video.height + ''}
        />
      </>
    );
  return (
    <>
      <meta
        httpEquiv="Refresh"
        content={`0; URL=${props.data.redirectUrl}`}
      />
      <meta property="theme-color" content={props.data.embed.color} />
      <meta property="og:image" content={props.data.embed.thumbnailUrl} />
      <meta
        property="og:title"
        content={props.data.embed.title}
      />
      <meta
        property="og:description"
        content={props.data.embed.description}
      />
      <link
        rel="alternate"
        href={props.data.embed.oembedUrl}
        type="application/json+oembed"
      />
    </>
  );
}
