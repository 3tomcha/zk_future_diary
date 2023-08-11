import { NextRequest } from 'next/server'
import pinataSDK from "@pinata/sdk";

export async function GET(req: NextRequest) {
  const imageIpfsHash = req.nextUrl.searchParams.get("image_ipfs_hash");
  const latitude = req.nextUrl.searchParams.get("latitude");
  const longitude = req.nextUrl.searchParams.get("longitude");
  const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT_KEY })
  const body = {
    description: "Friendly OpenSea Creature that enjoys long swims in the ocean.",
    external_url: "https://openseacreatures.io/3",
    image: `ipfs://${imageIpfsHash}`,
    name: "Dave Starbelly",
    attribute: {
      latitude: latitude,
      longitude: longitude
    }
  };
  const options = {
    pinataMetadata: {
      name: imageIpfsHash,
      keyvalues: {
        customKey: 'customValue',
        customKey2: 'customValue2'
      }
    },
    pinataOptions: {
      cidVersion: 0
    }
  };
  const res = await pinata.pinJSONToIPFS(body, options as any)
  console.log(res)
  return new Response(res.IpfsHash, {
    status: 200,
  })
}