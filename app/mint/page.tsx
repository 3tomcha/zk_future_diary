"use client";
import { SBTContractAddress } from "../const/contract"
import { SBTAbi } from "../abi/SBT.abi";
import { useAccount, useConnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import useClient from "../hooks/useClient";
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from "react";
import useLocation from "../hooks/useLocation";

export default function Mint() {
  const { address } = useAccount();
  const [imageIpfsHash, setImageIpfsHash] = useState("");
  const [jsonIpfsHash, setJsonIpfsHash] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const { getLocation } = useLocation();

  const searchParams = useSearchParams()
  console.log(searchParams.get("nullifier_hash"))
  const nullifierHash = searchParams.get("nullifier_hash")
  localStorage.setItem("nullifierHash", String(nullifierHash))
  const outImagePath = `./out/${nullifierHash}.png`
  const router = useRouter();

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
  const handlePosition = async () => {
    const res = await fetch(`/api/position?hash=${nullifierHash}`)
    console.log(res)
    if (res.ok) {
      const position = await res.json();
      console.log(position);
      setLatitude(position.latitude);
      setLongitude(position.longitude);
    }
  }
  const handlePinJSON = async () => {
    const res = await fetch(`/api/pin/json?image_ipfs_hash=${imageIpfsHash}&latitude=${latitude}&longitude=${longitude}`)
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
    if (address) {
      const { request } = await publicClient.simulateContract({
        address: SBTContractAddress,
        abi: SBTAbi,
        functionName: "mintNFT",
        args: [address, jsonIpfsHash],
        account: address,
      })
      const hash = await walletClient?.writeContract(request)
      console.log(hash)
    }
  }

  const goMyPage = () => {
    router.push("/mypage");
  }

  const goMap = async () => {
    router.push("/map");
  }

  return (
    <>
      <button onClick={handleConnect}>Connect</button>
      <button onClick={handleGenerate}>Generate</button>
      <button onClick={handlePinImage}>PinImage</button>
      <button onClick={handlePosition}>handlePosition</button>
      <button onClick={handlePinJSON}>PinJSON</button>
      <button onClick={getLocation}>getLocation</button>
      <button onClick={mint}>Mint</button>
      <button onClick={goMyPage}>goMyPage</button>
      <button onClick={goMap}>goMap</button>
    </>
  )
}