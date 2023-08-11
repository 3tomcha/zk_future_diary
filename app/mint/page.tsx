"use client";
import { SBTContractAddress } from "../const/contract"
import { SBTAbi } from "../abi/SBT.abi";
import { useAccount, useConnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import useClient from "../hooks/useClient";
import { useSearchParams } from 'next/navigation'
import { useState } from "react";

export default function Mint() {
  const { address } = useAccount();
  const [imageIpfsHash, setImageIpfsHash] = useState("");
  const [jsonIpfsHash, setJsonIpfsHash] = useState("");

  const searchParams = useSearchParams()
  console.log(searchParams.get("nullifier_hash"))
  const nullifierHash = searchParams.get("nullifier_hash")
  const outImagePath = `./out/${nullifierHash}.png`

  const handleGenerate = async () => {
    const res = await fetch(`/api/generate?prompt=${nullifierHash}`)
    console.log(res)
  }
  const handlePinImage = async () => {
    const res = await fetch(`/api/pin/image?file_name=${nullifierHash}`)
    console.log(res)
    if (res.ok) {
      const _imageIpfsHash = await res.text();
      setImageIpfsHash(_imageIpfsHash);
    }
  }
  const handlePinJSON = async () => {
    const res = await fetch(`/api/pin/json?image_ipfs_hash=${imageIpfsHash}`)
    console.log(res)
    if (res.ok) {
      const _jsonIpfsHash = await res.text();
      setJsonIpfsHash(_jsonIpfsHash);
    }
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
      <button onClick={handlePinImage}>PinImage</button>
      <button onClick={handlePinJSON}>PinJSON</button>
    </>
  )
}