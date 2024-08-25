"use client"
import { Field, Mina, PublicKey, fetchAccount } from "o1js";
import { TimeOracle } from "../../../contracts/build/src/TimeOracle.js";
import ZkappWorkerClient from "./zkappWorkerClient";
import { useEffect, useState } from "react";

// devnet
// const ZKAPP_ADDRESS = 'B62qkFa1VxZdfExsxwi1Zuqb7YZr8D2UotjweMQAfUSA6hSRyc4Gq3F';
const ORACLE_PUBLIC_KEY = "B62qiqNhiinraL2BhyfcLN5gaxBnKPbkMcpNrK14bkgLDihbTRN9Udv";
// local
// const ZKAPP_ADDRESS = "B62qoPKzra3xchXNNWup8U21V4s2fHFYfiZTeNBmCYVCGtr8LFEQvF7";

// devnet example
const ZKAPP_ADDRESS = 'B62qpXPvmKDf4SaFJynPsT6DyvuxMS9H1pT4TGonDT26m599m7dS9gP';
// Minaインスタンスをアクティブに設定

async function timeout(seconds: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}

export default function Schedule() {
  const [zkappWorkerClient, setZkappWorkerClient] = useState<ZkappWorkerClient>();

  useEffect(() => {
    (async () => {
      console.log("loading web worker")
      const _zkappWorkerClient = new ZkappWorkerClient()
      await timeout(5)
      console.log("Done loading web worker")
      await _zkappWorkerClient.setActiveInstanceToDevnet();

      const mina = (window as any).mina
      const publicKeyBase58 = (await mina.requestAccounts())[0]
      const publicKey = PublicKey.fromBase58(publicKeyBase58)
      console.log(`Using key: ${publicKey.toBase58()}`)

      await _zkappWorkerClient.loadContract()
      console.log("compiling zkApp")
      await _zkappWorkerClient.compileContract()
      console.log("compiling compiled")
      const zkAppPublicKey = PublicKey.fromBase58(ZKAPP_ADDRESS)
      await _zkappWorkerClient.initZkappInstance(zkAppPublicKey)
      console.log("Getting zkApp state...")
      await _zkappWorkerClient.fetchAccount({ publicKey: zkAppPublicKey })
      setZkappWorkerClient(_zkappWorkerClient)

    })()
  }, [])


  // useEffect(() => {
  //   (async () => {
  //     // const Local = await Mina.LocalBlockchain({ proofsEnabled: false });
  //     // Mina.setActiveInstance(Local);
  //     const Testnet = Mina.Network('https://api.minascan.io/node/devnet/v1/graphql');
  //     Mina.setActiveInstance(Testnet);
  //   })()
  // }, [])

  // const handleVerify = async () => {
  //   try {
  //     const Testnet = Mina.Network('https://api.minascan.io/node/devnet/v1/graphql');
  //     Mina.setActiveInstance(Testnet)
  //     console.log(Mina.activeInstance)
  //     const mina = (window as any).mina;
  //     if (!mina) {
  //       return;
  //     }

  //     const publicKeyBase58: string = (await mina.requestAccounts())[0];
  //     const publicKey = PublicKey.fromBase58(publicKeyBase58);

  //     const { error } = await fetchAccount({ publicKey });
  //     if (error) {
  //       console.error("Account does not exist or cannot be fetched.");
  //       return;
  //     }

  //     const timestamp = new Date().getTime();
  //     const response = await fetch(`/api/time?timestamp=${timestamp}`);
  //     const data = await response.json();

  //     const startTime = Field(data.data.startTime);
  //     const endTime = Field(data.data.endTime);
  //     await TimeOracle.compile()
  //     const zkappInstance = new TimeOracle(PublicKey.fromBase58(ZKAPP_ADDRESS));
  //     console.log(zkappInstance)
  //     await zkappInstance.init()

  //     console.log(Mina)
  //     Mina.setActiveInstance(Testnet)
  //     console.log(Mina.activeInstance)
  //     const tx = await Mina.transaction(publicKey, async () => {
  //       await zkappInstance.verify(
  //         Field(timestamp).div(Field(1000)), // ミリ秒から秒に変換
  //         data.signature,
  //         startTime,
  //         endTime
  //       );
  //     });

  //     await tx.prove();

  //     // AuroWalletを使ってトランザクションを送信
  //     const { hash } = await (window as any).mina.sendTransaction({
  //       transaction: tx.toJSON(),
  //       feePayer: {
  //         fee: '0.1', // 必要に応じて手数料を設定
  //         memo: 'zk',
  //       },
  //     });

  //     console.log(hash)

  //   } catch (error) {
  //     console.error("Initialization failed:", error);
  //   }
  // }
  const handleVerify = () => {
    console.log(zkappWorkerClient)
    zkappWorkerClient?.createUpdateTransaction()
  }
  return (
    <div className="container">
      <button onClick={handleVerify}>Verify Time</button>
    </div>
  );
}