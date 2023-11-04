export type SIGI_STATE = {
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

export type __UNIVERSAL_DATA_FOR_REHYDRATION__ = {
  __DEFAULT_SCOPE__: {
    'webapp.video-detail'?: {
      itemInfo: {
        itemStruct: {
          author: {
            id: string
            uniqueId: string
            nickname: string
            avatarLarger: string
          }
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
        }
      }
    }
  }
}

export function getPostInfo(data: __UNIVERSAL_DATA_FOR_REHYDRATION__, sigi?: SIGI_STATE | null) {
  const post = data.__DEFAULT_SCOPE__["webapp.video-detail"]?.itemInfo.itemStruct
    ?? Object.values(sigi?.ItemModule ?? {}).at(0);
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

export function getAuthorInfo(data: __UNIVERSAL_DATA_FOR_REHYDRATION__, sigi?: SIGI_STATE | null) {
  if (data.__DEFAULT_SCOPE__["webapp.video-detail"]) {
    const author = data.__DEFAULT_SCOPE__["webapp.video-detail"].itemInfo.itemStruct.author;
    return {
      id: author.id,
      handle: author.uniqueId,
      username: author.nickname,
      avatarUrl: author.avatarLarger,
    };
  }
  const userFromPost = Object.values(sigi?.ItemModule ?? {}).at(0);
  const user = Object.values(sigi?.UserModule?.users ?? {}).at(0);
  if (!userFromPost || !user)
    throw new Error(`Unable to extract data`);
  return {
    id: userFromPost.authorId,
    handle: userFromPost.author,
    username: userFromPost.nickname,
    avatarUrl: user.avatarLarger,
  };
}

export function getAttachments(data: __UNIVERSAL_DATA_FOR_REHYDRATION__, sigi?: SIGI_STATE | null) {
  const post = data.__DEFAULT_SCOPE__["webapp.video-detail"]?.itemInfo.itemStruct
    ?? Object.values(sigi?.ItemModule ?? {}).at(0);
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
        // TODO: check in future this will be flipped back
        width: image.imageHeight,
        height: image.imageWidth,
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
