"use client"
import { useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { SBTAbi } from "../abi/SBT.abi";
import { SBTContractAddress } from "../const/contract";
import useClient from "../hooks/useClient";

export default function MyPage() {
  const [imageUrl, setImageUrl] = useState("");
  const { connect } = useConnect({
    connector: new InjectedConnector
  });

  const { publicClient } = useClient();

  const read = async () => {
    const res = await publicClient.readContract({
      address: SBTContractAddress,
      abi: SBTAbi,
      functionName: "tokenURI",
      args: [BigInt(3)],
    })
    const res1 = await fetch(`https://gateway.pinata.cloud/ipfs/${res}`);
    const json1 = await res1.json()
    const image1 = json1.image.split("ipfs://")[1]

    setImageUrl(`https://gateway.pinata.cloud/ipfs/${image1}`)

  }

  return (
    <div>mypage
      <button onClick={read}>Read</button>
      <img src={imageUrl} alt="" />
    </div>
  )
}