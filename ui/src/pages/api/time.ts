// pages/api/time.ts

import { NetworkId } from 'o1js';
import { NextApiRequest, NextApiResponse } from 'next';
// @ts-ignore
import Client from 'mina-signer';

const client = new Client({ network: process.env.NETWORK_KIND as NetworkId ?? 'testnet' });

function getSignedTime(timestamp: bigint) {
  let privateKey =
    process.env.PRIVATE_KEY ??
    'EKF65JKw9Q1XWLDZyZNGysBbYG21QbJf3a4xnEoZPZ28LKYGMw53';

  // UNIX時間での1時間（3600秒）
  const oneHourInSeconds = BigInt(3600);

  // 現在の時間を1時間ごとに丸める
  const roundedTimestamp = timestamp - (timestamp % oneHourInSeconds);

  // 1時間の範囲の開始と終了
  const startTime = roundedTimestamp;
  const endTime = roundedTimestamp + oneHourInSeconds;

  // 範囲に対して署名を行う
  const signature = client.signFields([startTime, endTime], privateKey);

  return {
    data: {
      currentTime: timestamp.toString(), // 現在の時間を文字列で返す
      startTime: startTime.toString(),   // 開始時間を文字列で返す
      endTime: endTime.toString(),       // 終了時間を文字列で返す
    },
    signature: signature.signature,
    publicKey: signature.publicKey,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { timestamp } = req.query;
    const timestampValue = BigInt(timestamp?.toString() || Date.now().toString());

    const signedTime = getSignedTime(timestampValue);
    res.status(200).json(signedTime);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
