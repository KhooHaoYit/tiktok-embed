export type Data = {
  ItemModule?: Record<string, Post>
  UserModule?: {
    users: Record<string, User>
  }
};

export type User = {
  avatarLarger: string
};

export type Post = {
  author: string
  authorId: string
  nickname: string
  desc: string
  id: string
  imagePost?: {
    images: {
      imageWidth: number
      imageHeight: number
      imageURL: {
        urlList: string[]
      }
    }[]
  }
  video: {
    width: number
    height: number
    originCover: string
    downloadAddr: string
    format: string
  }
  stats: {
    diggCount: number
    shareCount: number
    commentCount: number
  }
};



export function getPostInfo(data: Data) {
  const post = Object.values(data.ItemModule ?? {}).at(0);
  if (!post)
    throw new Error(`Unable to extract data`);
  return {
    id: post.id,
    description: post.desc,
    comments: post.stats.commentCount,
    likes: post.stats.diggCount,
    shares: post.stats.shareCount,
  };
}

export function getAuthorInfo(data: Data) {
  const userFromPost = Object.values(data.ItemModule ?? {}).at(0);
  const user = Object.values(data.UserModule?.users ?? {}).at(0);
  if (!userFromPost || !user)
    throw new Error(`Unable to extract data`);
  return {
    id: userFromPost.id,
    handle: userFromPost.author,
    username: userFromPost.nickname,
    avatarUrl: user.avatarLarger,
  };
}

export function getAttachments(data: Data) {
  const post = Object.values(data.ItemModule ?? {}).at(0);
  if (!post)
    throw new Error(`Unable to extract data`);
  const attachments: {
    id: string
    width: number
    height: number
    imageUrl: string
    imageFilename: string
    videoUrl?: string
    videoFilename?: string
  }[] = [];
  if (post.imagePost)
    for (const image of post.imagePost.images) {
      const imageFilename = image.imageURL.urlList[0]
        .split('/').at(-1)!
        .split('?')[0]
        .replace(/~[^.]+/, '');
      attachments.push({
        id: imageFilename.split('.')[0],
        width: image.imageWidth,
        height: image.imageHeight,
        imageUrl: image.imageURL.urlList[0],
        imageFilename,
      });
    }
  else {
    const imageFilename = post.video.originCover
      .split('/').at(-1)!
      .split('?')[0] + '.jpg';
    const videoFilename = post.video.downloadAddr.split('/').at(-2)! + '.' + post.video.format;
    attachments.push({
      id: imageFilename.split('_')[0],
      width: post.video.width,
      height: post.video.height,
      imageUrl: post.video.originCover,
      imageFilename,
      videoUrl: post.video.downloadAddr,
      videoFilename,
    });
  }
  return attachments;
}
