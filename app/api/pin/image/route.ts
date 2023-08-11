import { NextRequest } from 'next/server'
import pinataSDK from "@pinata/sdk";

export async function GET(req: NextRequest) {
  const fileName = req.nextUrl.searchParams.get("file_name");
  const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT_KEY })
  const sourcePath = `./out/${fileName}`;
  const options = {
    pinataMetadata: {
      name: fileName,
      keyvalues: {
        customKey: 'customValue',
        customKey2: 'customValue2'
      }
    },
    pinataOptions: {
      cidVersion: 0
    }
  };
  const res = await pinata.pinFromFS(sourcePath, options)
  console.log(res)
  return new Response(res.IpfsHash, {
    status: 200,
  })
}