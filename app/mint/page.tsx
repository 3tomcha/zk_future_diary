"use client";
import { SBTContractAddress } from "../const/contract"
import { SBTAbi } from "../abi/SBT.abi";
import { useAccount, useConnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import useClient from "../hooks/useClient";
import { useSearchParams } from 'next/navigation'

export default function Mint() {
  const { address } = useAccount();
  const searchParams = useSearchParams()
  console.log(searchParams.get("nullifier_hash"))
  const nullifierHash = searchParams.get("nullifier_hash")
  const outImagePath = `./out/${nullifierHash}.png`

  const handleGenerate = async () => {
    const res = await fetch(`/api/generate?prompt=${nullifierHash}`)
    console.log(res)
  }

  const { connect } = useConnect({
    connector: new InjectedConnector
  });

  const { publicClient, walletClient } = useClient();

  const handleConnect = async () => {
    await connect();
  }

  const mint = async () => {
    console.log("mint")
    if (!address) {
      await connect();
    }

    const { request } = await publicClient.simulateContract({
      address: SBTContractAddress,
      abi: SBTAbi,
      functionName: "mintNFT",
      args: [address, "http://google.co.jp"],
      account: address,
    })
    const hash = await walletClient.writeContract(request)
    console.log(hash)
  }

  return (
    <>
      <button onClick={mint}>Mint</button>
      <button onClick={handleConnect}>Connect</button>
      <button onClick={handleGenerate}>Generate</button>
    </>
  )
}