import { NextRequest, NextResponse } from 'next/server'
import fetch from 'node-fetch'
// import pinataSDK from "@pinata/sdk";
// @ts-ignore
import Client from 'mina-signer';
import { GoogleMapsResponse, PlaceResult } from '../../types/googlemap';
const client = new Client({ network: 'testnet' });

// Implement toJSON for BigInt so we can include values in response
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

function getSignedGeometry(locations: {
  lat: number;
  lng: number;
}[]) {
  let privateKey =
    process.env.PRIVATE_KEY ??
    'EKF65JKw9Q1XWLDZyZNGysBbYG21QbJf3a4xnEoZPZ28LKYGMw53';

  const signature = client.signFields(
    [locations],
    privateKey
  )
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
  const locations = await getGoogleMapResponse()
  return NextResponse.json(
    getSignedGeometry(locations),
    { status: 200 }
  );
}