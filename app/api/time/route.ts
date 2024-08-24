import { NetworkId } from 'o1js';
// app/api/time/route.ts
import { NextResponse } from 'next/server';
// @ts-ignore
import Client from 'mina-signer';

const client = new Client({ network: process.env.NETWORK_KIND as NetworkId ?? 'testnet' });

function getSignedTime() {
  let privateKey =
    process.env.PRIVATE_KEY ??
    'EKF65JKw9Q1XWLDZyZNGysBbYG21QbJf3a4xnEoZPZ28LKYGMw53';
  const currentTime = new Date().getTime(); // Convert currentTime to a bigint
  const signature = client.signFields([BigInt(currentTime)], privateKey);

  return {
    data: { currentTime: currentTime.toString() }, // BigInt を文字列に変換
    signature: signature.signature,
    publicKey: signature.publicKey,
  };
}

export async function GET() {
  return NextResponse.json(getSignedTime(), {
    status: 200,
  });
}
