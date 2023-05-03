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
  id: '7228356146015374634',
  heartCount: '90300',
  shareCount: '3510',
  commentCount: '2077',
  description: '#CapCut .',
  videoUrl: 'https://cdn.discordapp.com/attachments/860534599242481684/1103212243270762526/319285166936346624.7228356146015374634.mp4',
  videoCover: 'https://cdn.discordapp.com/attachments/860534599242481684/1103212245741228032/319285166936346624.7228356146015374634.jpg',
  videoWidth: 576,
  videoHeight: 768,
  videoHash: 'oUbkuPRxECnUwQwDaR8cIIo7DLDeUgB1EAQSeA',
  authorId: '319285166936346624',
  i_createdAt: '2023-05-03T06:51:32.041Z',
  i_updatedAt: '2023-05-03T06:51:36.294Z',
  i_fetchedAt: '2023-05-03T06:51:36.292Z',
  author: {
    id: '319285166936346624',
    name: 'noneofitwasreal.com_love',
    nickname: '.',
    avatarUrl: 'https://cdn.discordapp.com/attachments/860534599242481684/1103212230473961523/319285166936346624.aa6b3db4fba5a9d6e25adf9a4cb828fe.jpeg',
    avatarHash: 'aa6b3db4fba5a9d6e25adf9a4cb828fe',
    i_createdAt: '2023-05-03T06:51:32.041Z',
    i_updatedAt: '2023-05-03T06:51:32.802Z',
    i_fetchedAt: '2023-05-03T06:51:32.801Z'
  }
};
