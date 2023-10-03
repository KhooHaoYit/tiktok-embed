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
