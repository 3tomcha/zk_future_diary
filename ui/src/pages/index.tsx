import { useEffect, useState } from "react";
import ZkappWorkerClient from "../zkappWorkerClient";
import { Field, PublicKey, Signature } from "o1js";
import ScheduleItem from "@/components/ScheduleItem";
import { Schedule, useGenerateschedule } from "@/hooks/useGenerateSchedule";
import { useGenerateImage } from "@/hooks/useGenerateImage";

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
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const { schedule, fetchSchedule, setSchedule } = useGenerateschedule();
  const [randomIndex, setRandomIndex] = useState(-1);

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

  const handleVerify = async (targetStartTimestamp: Number, targetEndTimestamp: Number) => {
    const timestamp = Math.floor(new Date().getTime() / 1000)
    const response = await fetch(`/api/time?timestamp=${timestamp}`)
    const data = await response.json()
    console.log(data)
    const args = {
      signature: data.signature,
      startTime: data.data.startTime,
      endTime: data.data.endTime,
      targetStartTimestamp: targetStartTimestamp,
      targetEndTimestamp: targetEndTimestamp
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
  const handlePromptChange = (event: any) => {
    setPrompt(event.target.value);
  };
  const updateSchedule = async () => {
    setLoading(true);
    await fetchSchedule(prompt);
    setLoading(false);
  }

  if (schedule && schedule.length > 0) {
    return (
      <div className="container">
        <ul className="schedule-list" id="schedule">
          {schedule.map((item) => {
            return (
              <ScheduleItem {...item} key={item.time} onVerify={handleVerify} />
            )
          })}
        </ul>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>未来日記</h1>
      <div className="form-container">
        <input
          type="text"
          className="form-input"
          id="prompt"
          placeholder="あなたのなりたい姿を具体的に書いてね"
          value={prompt}
          onChange={handlePromptChange}
          required
        />
        <button className="form-button" onClick={updateSchedule}>
          生成
        </button>
      </div>
    </div>
  )
}