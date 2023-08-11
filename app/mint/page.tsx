"use client";
import { SBTContractAddress, targetChain } from "../const/contract"
import { SBTAbi } from "../abi/SBT.abi";
import { useAccount, useConnect } from 'wagmi'
import { createWalletClient, custom, createPublicClient, http, parseAbiItem } from "viem";
import { InjectedConnector } from 'wagmi/connectors/injected'

export default function Mint() {
  const { address, isConnected } = useAccount();

  const { connect } = useConnect({
    connector: new InjectedConnector
  });

  const handleConnect = async () => {
    await connect();
  }

  const mint = async () => {
    console.log("mint")
    if (!address) {
      await connect();
    }

    const walletClient = createWalletClient({
      chain: targetChain,
      transport: custom((window as any).ethereum),
    })
    const publicClient = createPublicClient({
      chain: targetChain,
      transport: http(`https://opt-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
    })
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
    </>
  )
}