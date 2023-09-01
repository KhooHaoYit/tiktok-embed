import { instagramEmbedEmbedder } from "@/embedder/providers/instagram";
import { tiktokEmbedEmbedder } from "@/embedder/providers/tiktok";
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.query.type as string) {
    default: {
      res.status(404).json({ error: 'Invalid type' });
    } break;
    case 'instagram': {
      const shortcode = req.query.shortcode as string;
      const { embed } = await instagramEmbedEmbedder(shortcode);
      res.status(200)
        .json({
          author_name: embed.authorName,
          author_url: embed.authorUrl,
          provider_name: embed.providerName,
        });
    } break;
    case 'tiktok': {
      const postId = req.query.postId as string;
      const { embed } = await tiktokEmbedEmbedder(postId);
      res.status(200)
        .json({
          author_name: embed.authorName,
          author_url: embed.authorUrl,
          provider_name: embed.providerName,
        });
    } break;
  }
}
