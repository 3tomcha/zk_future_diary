"use client"
import { useEffect, useState } from "react";
import { Field, Mina, PublicKey, fetchAccount } from "o1js";
import { TimeOracle } from "../../contracts/build/src/TimeOracle.js";

// devnet
const ZKAPP_ADDRESS = 'B62qkFa1VxZdfExsxwi1Zuqb7YZr8D2UotjweMQAfUSA6hSRyc4Gq3F';

// local
// const ZKAPP_ADDRESS = "B62qoPKzra3xchXNNWup8U21V4s2fHFYfiZTeNBmCYVCGtr8LFEQvF7";

// Minaインスタンスをアクティブに設定


export default function Schedule() {
  useEffect(() => {
    (async () => {
      // const Local = await Mina.LocalBlockchain({ proofsEnabled: false });
      // Mina.setActiveInstance(Local);
      const Testnet = await Mina.Network('https://api.minascan.io/node/devnet/v1/graphql');
      Mina.setActiveInstance(Testnet);
    })()
  }, [])

  const handleVerify = async () => {
    const Testnet = await Mina.Network('https://api.minascan.io/node/devnet/v1/graphql');
    Mina.setActiveInstance(Testnet);
    try {
      const mina = (window as any).mina;
      console.log(mina);

      if (!mina) {
        return;
      }

      const publicKeyBase58: string = (await mina.requestAccounts())[0];
      const publicKey = PublicKey.fromBase58(publicKeyBase58);

      const { error } = await fetchAccount({ publicKey });
      if (error) {
        console.error("Account does not exist or cannot be fetched.");
        return;
      }

      const timestamp = new Date().getTime();
      const response = await fetch(`/api/time?timestamp=${timestamp}`);
      const data = await response.json();

      const startTime = Field(data.data.startTime);
      const endTime = Field(data.data.endTime);

      const zkappInstance = new TimeOracle(PublicKey.fromBase58(ZKAPP_ADDRESS));
      await zkappInstance.verify(
        Field(timestamp), // ミリ秒から秒に変換
        data.signature,
        startTime,
        endTime
      );
    } catch (error) {
      console.error("Initialization failed:", error);
    }
  }

  return (
    <div className="container">
      <button onClick={handleVerify}>Verify Time</button>
    </div>
  );
}