import { NextRequest, NextResponse } from 'next/server'
import fetch from 'node-fetch'

// @ts-ignore
import Client from 'mina-signer';
import { GoogleMapsResponse, PlaceResult } from '../../types/googlemap';
const client = new Client({ network: 'testnet' });

// Implement toJSON for BigInt so we can include values in response
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

type Location = {
  lat: number;
  lng: number;
}

function getSignedGeometry(userLocationLat: number, userLocationLng: number, locations: Location[]) {
  let privateKey =
    process.env.PRIVATE_KEY ??
    'EKF65JKw9Q1XWLDZyZNGysBbYG21QbJf3a4xnEoZPZ28LKYGMw53';

  console.log(userLocationLat)
  console.log(userLocationLng)
  const isTrue = locations.some(l => l.lat == userLocationLat && l.lng == userLocationLng)

  // 全てのlocationの緯度と経度を一つの署名で扱う
  const signature = client.signFields(
    [BigInt(Math.ceil(userLocationLat * 10000)), BigInt(Math.ceil(userLocationLng * 10000)), BigInt(isTrue)],
    privateKey
  );

  return {
    data: isTrue,
    signature: signature.signature,
    publicKey: signature.publicKey
  }
}

async function getGoogleMapResponse() {
  const GOOGLEMAP_API_KEY = process.env.GOOGLEMAP_API_KEY
  console.log(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+Tokyo&key=${GOOGLEMAP_API_KEY}`)
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+Tokyo&key=${GOOGLEMAP_API_KEY}`
  )
  const responseJSON = await response.json() as GoogleMapsResponse
  const locations = responseJSON.results.map(r => r.geometry.location)
  console.log(locations)
  return locations
}

export async function GET(req: NextRequest) {
  // クエリパラメータの取得
  const url = req.nextUrl;
  const lat = Number(url.searchParams.get('lat')) ?? 0;
  const lng = Number(url.searchParams.get('lng')) ?? 0;

  const locations = await getGoogleMapResponse()
  console.log(locations)
  return NextResponse.json(
    getSignedGeometry(lat, lng, locations),
    { status: 200 }
  );
}