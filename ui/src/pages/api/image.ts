import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import { generateAsync } from 'stability-client'; // 適切なパスに置き換えてください

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const prompt = req.query.prompt as string;
      const { res, images } = await generateAsync({
        prompt: 'Cats owned by wealthy people', //富裕層が飼ってるネコ
        apiKey: 'APIキー',
      })
      console.log(images)
    } catch (e) {
      console.log(e)
    }

    //   const answers = await stabilityApi.generate({ prompt });

    //   for (const resp of answers) {
    //     for (const artifact of resp.artifacts) {
    //       if (artifact.finish_reason === 'FILTER') {
    //         console.warn(
    //           "Your request activated the API's safety filters and could not be processed. Please modify the prompt and try again."
    //         );
    //         res.status(400).send("Request blocked by API's safety filters.");
    //         return;
    //       }

    //       if (artifact.type === 'ARTIFACT_IMAGE') {
    //         const buffer = Buffer.from(artifact.binary, 'base64'); // 例としてbase64エンコードと仮定
    //         const stream = Readable.from(buffer);

    //         res.setHeader('Content-Type', 'image/png');
    //         res.setHeader('Content-Disposition', 'inline');
    //         stream.pipe(res);
    //         return;
    //       }
    //     }
    //   }

    //   res.status(404).send('No image generated.');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
} else {
  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
}
