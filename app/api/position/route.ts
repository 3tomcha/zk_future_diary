import { NextRequest } from 'next/server'
import fetch from 'node-fetch'
// import pinataSDK from "@pinata/sdk";

type GoogleMapsResponse = {
  status: string;
  results: PlaceResult[];
  error_message?: string;
};

type PlaceResult = {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    viewport?: {
      northeast: { lat: number; lng: number };
      southwest: { lat: number; lng: number };
    };
  };
  name: string;
  opening_hours?: {
    open_now: boolean;
  };
  photos?: {
    height: number;
    width: number;
    photo_reference: string;
  }[];
  place_id: string;
  rating?: number;
  reference: string;
  types: string[];
};


export async function GET(req: NextRequest) {
  const GOOGLEMAP_API_KEY = process.env.GOOGLEMAP_API_KEY
  console.log(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+Tokyo&key=${GOOGLEMAP_API_KEY}`)
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+Tokyo&key=${GOOGLEMAP_API_KEY}`
  )
  const responseJSON = await response.json() as GoogleMapsResponse
  const geometries = responseJSON.results.map(r => r.geometry)
  console.log(geometries)

  return new Response(JSON.stringify(geometries), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}