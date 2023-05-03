import { fetchTikTokPost, getTikTokPost } from "@/backend";
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const postId = req.query.id as string;
  const post = await getTikTokPost(postId)
    || await fetchTikTokPost(postId);
  if (!post)
    throw new Error(`Unable to fetch postId: ${postId}`);
  res.status(200)
    .json({
      author_name: [
        ['💬', +post.commentCount],
        ['🔁', +post.shareCount],
        ['❤️', +post.heartCount],
      ].filter(item => item[1])
        .map(([emoji, amount]) => `${amount.toLocaleString('en')} ${emoji}`)
        .join('    '),
      author_url: `https://www.tiktok.com/@${post.author.name}/video/${post.id}`,
      provider_name: 'TikTok Embed',
    });
}
