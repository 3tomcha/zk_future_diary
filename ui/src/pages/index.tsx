import { useEffect, useState } from "react";
import ZkappWorkerClient from "../zkappWorkerClient";
import { Field, PublicKey, Signature } from "o1js";

type StateType = {
  zkappWorkerClient: ZkappWorkerClient | null;
  hasWallet: boolean | null;
  hasBeenSetup: Boolean,
  accountExists: Boolean,
  currentNum: null | Field,
  publicKey: null | PublicKey,
  zkAppPrivateKey: null | PublicKey,
  creatingTransaction: Boolean
};

async function timeout(seconds: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}
const ZKAPP_ADDRESS = 'B62qkKoAxSnk7cmgsvLqEVoov672nekS8iwbpPU1Wutp7AEdZwJNfYV';

export default function Home() {
  const [state, setState] = useState<StateType>({
    zkappWorkerClient: null,
    hasWallet: null,
    hasBeenSetup: false,
    accountExists: false,
    currentNum: null,
    publicKey: null,
    zkAppPrivateKey: null,
    creatingTransaction: false
  })

  useEffect(() => {
    (async () => {
      if (!state.hasBeenSetup) {
        console.log("loading web worker")
        const zkappWorkerClient = new ZkappWorkerClient()
        await timeout(5)
        console.log("Done loading web worker")
        await zkappWorkerClient.setActiveInstanceToDevnet();

        const mina = (window as any).mina
        const publicKeyBase58 = (await mina.requestAccounts())[0]
        const publicKey = PublicKey.fromBase58(publicKeyBase58)
        console.log(`Using key: ${publicKey.toBase58()}`)

        await zkappWorkerClient.loadContract()
        console.log("compiling zkApp")
        await zkappWorkerClient.compileContract()
        console.log("compiling compiled")
        const zkAppPublicKey = PublicKey.fromBase58(ZKAPP_ADDRESS)
        await zkappWorkerClient.initZkappInstance(zkAppPublicKey)
        console.log("Getting zkApp state...")
        await zkappWorkerClient.fetchAccount({ publicKey: zkAppPublicKey })
        setState({
          ...state,
          zkappWorkerClient,
          hasWallet: true,
          hasBeenSetup: true,
          publicKey,
        });
      }
    })()
  }, [])

  const handleUpdate = async () => {
    const response = await fetch("/api/time")
    const data = await response.json()
    console.log(data)
    const timestamp = new Date().getTime()
    const args = {
      timestamp: timestamp,
      signature: data.signature,
      startTime: data.data.startTime,
      endTime: data.data.endTime
    }
    await state.zkappWorkerClient!.createUpdateTransaction(
      args
    );
    console.log('Creating proof...');
    await state.zkappWorkerClient!.proveUpdateTransaction();

    console.log('Requesting send transaction...');
    const transactionJSON = await state.zkappWorkerClient!.getTransactionJSON();

    console.log('Getting transaction JSON...');
    const { hash } = await (window as any).mina.sendTransaction({
      transaction: transactionJSON,
      feePayer: {
        fee: 0.1,
        memo: '',
      },
    });
    console.log(hash)
  }

  return (
    <button onClick={handleUpdate}>handleUpdate</button>
  )
}