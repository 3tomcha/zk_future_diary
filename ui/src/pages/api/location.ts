import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import Client from 'mina-signer';
import { GoogleMapsResponse } from '../../types/googlemap';

const client = new Client({ network: 'testnet' });

type Location = {
  lat: number;
  lng: number;
}

// Implement toJSON for BigInt so we can include values in the response
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

function getSignedGeometry(userLocationLat: number, userLocationLng: number, locations: Location[]) {
  let privateKey =
    process.env.PRIVATE_KEY ?? 'EKF65JKw9Q1XWLDZyZNGysBbYG21QbJf3a4xnEoZPZ28LKYGMw53';

  const isTrue = locations.some(l => l.lat === userLocationLat && l.lng === userLocationLng);

  // Convert the latitude and longitude to integers by multiplying by a factor (e.g., 100000)
  const latBigInt = BigInt(Math.round(userLocationLat * 100000));
  const lngBigInt = BigInt(Math.round(userLocationLng * 100000));

  // Sign the fields for all the locations' latitudes and longitudes
  const signature = client.signFields(
    [latBigInt, lngBigInt, BigInt(isTrue ? 1 : 0)],
    privateKey
  );

  return {
    data: isTrue,
    signature: signature.signature,
    publicKey: signature.publicKey,
  };
}

async function getGoogleMapResponse() {
  const GOOGLEMAP_API_KEY = process.env.GOOGLEMAP_API_KEY;
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+Tokyo&key=${GOOGLEMAP_API_KEY}`
  );
  const responseJSON = await response.json() as GoogleMapsResponse;
  const locations = responseJSON.results.map(r => r.geometry.location);
  return locations;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Extract query parameters
      const lat = Number(req.query.lat) ?? 0;
      const lng = Number(req.query.lng) ?? 0;

      const locations = await getGoogleMapResponse();

      // Return the signed geometry
      res.status(200).json(getSignedGeometry(lat, lng, locations));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
