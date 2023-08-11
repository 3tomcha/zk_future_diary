import { NextRequest } from 'next/server'
import pinataSDK from "@pinata/sdk";

export async function GET(req: NextRequest) {
  const hash = req.nextUrl.searchParams.get("hash");

  if (!hash) {
    return;
  }
  const hashNumber = BigInt(hash);

  // ハッシュ値を範囲 0-1 にマッピング
  const normalizedLat = (Number(hashNumber % BigInt(1000000)) / 1000000);
  const normalizedLon = (Number((hashNumber / BigInt(1000000)) % BigInt(1000000)) / 1000000);

  const mapValue = (value, start1, stop1, start2, stop2) => {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
  };

  const latitude = mapValue(normalizedLat, 0, 1, 35.525, 35.815);
  const longitude = mapValue(normalizedLon, 0, 1, 139.595, 139.925);

  const position = {
    latitude: latitude,
    longitude: longitude
  }

  return new Response(JSON.stringify(position), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}