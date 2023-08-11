import fetch from 'node-fetch'
import fs from 'node:fs'

export async function GET() {
  const engineId = 'stable-diffusion-xl-1024-v1-0'
  const apiHost = process.env.API_HOST ?? 'https://api.stability.ai'
  const apiKey = process.env.STABILITY_API_KEY

  if (!apiKey) throw new Error('Missing Stability API key.')

  const response = await fetch(
    `${apiHost}/v1/generation/${engineId}/text-to-image`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: 'A lighthouse on a cliff',
          },
        ],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        steps: 30,
        samples: 1,
      }),
    }
  )

  if (!response.ok) {
    throw new Error(`Non-200 response: ${await response.text()}`)
  }

  interface GenerationResponse {
    artifacts: Array<{
      base64: string
      seed: number
      finishReason: string
    }>
  }

  const responseJSON = (await response.json()) as GenerationResponse

  const image = responseJSON.artifacts[0];
  const fileName = `./out/v1_txt2img_0.png`;

  const dir = './out';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(
    fileName,
    Buffer.from(image.base64, 'base64')
  )

  return new Response("succeeded", {
    status: 200,
  })
}

