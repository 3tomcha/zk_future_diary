"use client"

import { useEffect, useState } from "react";
import ScheduleItem from "../components/ScheduleItem"
import ZkappWorkerClient from "../zkappWorkerClient";
import { Field, PublicKey } from "o1js";

const mockSchedule = [
  { "time": "00:00", "value": "睡眠" },
  { "time": "01:00", "value": "睡眠" },
  { "time": "02:00", "value": "睡眠" },
  { "time": "03:00", "value": "睡眠" },
  { "time": "04:00", "value": "睡眠" },
  { "time": "05:00", "value": "ランニング" },
  { "time": "06:00", "value": "シャワー" },
  { "time": "07:00", "value": "朝食: 野菜スムージー" },
  { "time": "08:00", "value": "仕事" },
  { "time": "09:00", "value": "仕事" },
  { "time": "10:00", "value": "スナック: キウイ" },
  { "time": "11:00", "value": "仕事" },
  { "time": "12:00", "value": "ランチ: グリルチキンとサラダ" },
  { "time": "13:00", "value": "仕事" },
  { "time": "14:00", "value": "仕事" },
  { "time": "15:00", "value": "スナック: プロテインバー" },
  { "time": "16:00", "value": "ジム: カーディオトレーニング" },
  { "time": "17:00", "value": "ジム: ウェイトトレーニング" },
  { "time": "18:00", "value": "夕食: サーモンと野菜" },
  { "time": "19:00", "value": "ストレッチとリラックス" },
  { "time": "20:00", "value": "読書" },
  { "time": "21:00", "value": "軽いヨガ" },
  { "time": "22:00", "value": "夜のおやつ: ギリシャヨーグルト" },
  { "time": "23:00", "value": "睡眠" },
]


export default function Schedule() {
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
        // const currentNum = await zkappWorkerClient.getNum();
        // console.log(`Current state in zkApp: ${currentNum.toString()}`);
        setDisplayText('');

        setState({
          ...state,
          zkappWorkerClient,
          hasWallet: true,
          hasBeenSetup: true,
          publicKey,
          zkappPublicKey,
          accountExists,
          // currentNum
        });
      }
    })();
  }, []);

  const handleVerify = () => {
    console.log('verify')
  }
  if (state.hasWallet) {
    return (
      <div className="container">
        <ul className="schedule-list" id="schedule">
          {mockSchedule.map((item) => {
            return (
              <ScheduleItem {...item} key={item.time} onVerify={handleVerify} />
            )
          })}
        </ul>
      </div>
    )
  }
}