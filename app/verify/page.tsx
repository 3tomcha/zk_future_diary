"use client"
import useLocation from '../hooks/useLocation';
import { useEffect, useState } from "react";
import ZkappWorkerClient from '../zkappWorkerClient';
import { Field, PublicKey } from 'o1js';

// ユーザーの位置情報の取得
// verifyapi

export function Verifyw() {
  let transactionFee = 0.1;
  const ZKAPP_ADDRESS = 'B62qo2Be4Udo5EG1ux9yMJVkXe9Gz945cocN7Bn4W9DSYyeHZr1C3Ea';

  const [state, setState] = useState({
    zkappWorkerClient: null as null | ZkappWorkerClient,
    hasWallet: null as null | boolean,
    hasBeenSetup: false,
    accountExists: false,
    currentNum: null as null | Field,
    publicKey: null as null | PublicKey,
    zkappPublicKey: null as null | PublicKey,
    creatingTransaction: false
  });

  const [displayText, setDisplayText] = useState('');
  const [transactionlink, setTransactionLink] = useState('');

  useEffect(() => {
    async function timeout(seconds: number): Promise<void> {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, seconds * 1000);
      });
    }

    (async () => {
      if (!state.hasBeenSetup) {
        setDisplayText('Loading web worker...');
        console.log('Loading web worker...');
        const zkappWorkerClient = new ZkappWorkerClient();
        await timeout(5);

        setDisplayText('Done loading web worker');
        console.log('Done loading web worker');

        await zkappWorkerClient.setActiveInstanceToBerkeley();

        const mina = (window as any).mina;

        if (mina == null) {
          setState({ ...state, hasWallet: false });
          return;
        }

        const publicKeyBase58: string = (await mina.requestAccounts())[0];
        const publicKey = PublicKey.fromBase58(publicKeyBase58);

        console.log(`Using key:${publicKey.toBase58()}`);
        setDisplayText(`Using key:${publicKey.toBase58()}`);

        setDisplayText('Checking if fee payer account exists...');
        console.log('Checking if fee payer account exists...');

        const res = await zkappWorkerClient.fetchAccount({
          publicKey: publicKey!
        });
        const accountExists = res.error == null;

        await zkappWorkerClient.loadContract();

        console.log('Compiling zkApp...');
        setDisplayText('Compiling zkApp...');
        await zkappWorkerClient.compileContract();
        console.log('zkApp compiled');
        setDisplayText('zkApp compiled...');

        const zkappPublicKey = PublicKey.fromBase58(ZKAPP_ADDRESS);

        await zkappWorkerClient.initZkappInstance(zkappPublicKey);

        console.log('Getting zkApp state...');
        setDisplayText('Getting zkApp state...');
        await zkappWorkerClient.fetchAccount({ publicKey: zkappPublicKey });
        const currentNum = await zkappWorkerClient.getNum();
        console.log(`Current state in zkApp: ${currentNum.toString()}`);
        setDisplayText('');

        setState({
          ...state,
          zkappWorkerClient,
          hasWallet: true,
          hasBeenSetup: true,
          publicKey,
          zkappPublicKey,
          accountExists,
          currentNum
        });
      }
    })();
  }, []);

  return <div></div>
}

export default function Verify() {
  const { getLocation, userLatitude, userLongitude } = useLocation();

  const verify = async () => {
    const res = await fetch(`/api/position`)
    const json = await res.json()
    if (res.ok) {
      alert("verify success")
    } else {
      alert("verify failed")
    }
  }

  return (
    <div className="container">
      <button onClick={getLocation}>getLocation</button>
      <button onClick={verify}>verify</button>
      {userLatitude != 0 && userLongitude != 0 && (
        <>
          <h2>{userLatitude}</h2>
          <h2>{userLongitude}</h2>
        </>
      )}
      <h1>未来日記</h1>
      <Verifyw />
    </div >
  )
}