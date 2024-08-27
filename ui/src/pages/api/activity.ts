import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function completion(prompt: string) {
  const _completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: prompt }],
    model: "gpt-3.5-turbo",
  });
  return _completion.choices[0];
}

export const config = {
  api: {
    bodyParser: false, // Next.js のデフォルトの bodyParser を無効化
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // ファイルアップロードの処理
      const file = req.body.file; // 画像ファイルのデータを取得
      const imagePath = path.join(process.cwd(), 'uploads', file.name);

      // ファイルを保存
      fs.writeFileSync(imagePath, file.data);

      // 画像を base64 に変換
      const imageBuffer = fs.readFileSync(imagePath);
      const imageBase64 = imageBuffer.toString('base64');

      // 画像判定のプロンプトを生成
      const prompt = `This is an image. Please determine if it matches the following description: ${req.query.prompt}`;

      // OpenAI API にリクエスト
      const _completion = await completion(prompt);

      res.status(200).json(_completion);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
