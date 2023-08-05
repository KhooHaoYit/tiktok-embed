import { request } from "undici";
import { env } from "./env";

export async function getTikTokPost(postId: string) {
  return await request(`${env.BACKEND_URL}/tikTokPost/${postId}`)
    .then(res => <Promise<null | Data>>res.body.json());
}

export async function fetchTikTokPost(postId: string) {
  return await request(`${env.BACKEND_URL}/tikTokPost/${postId}/fetch`, { method: 'POST' })
    .then(res => <Promise<null | Data>>res.body.json());
}

type Data = {
  id: string
  heartCount: string
  shareCount: string
  commentCount: string
  description: string
  videoUrl: string
  videoCover: string
  videoWidth: number
  videoHeight: number
  videoHash: string
  authorId: string
  i_createdAt: string
  i_updatedAt: string
  i_fetchedAt: string
  author: {
    id: string
    name: string
    nickname: string
    avatarUrl: string
    avatarHash: string
    i_createdAt: string
    i_updatedAt: string
    i_fetchedAt: string
  }
};
