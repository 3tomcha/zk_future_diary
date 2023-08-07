'use client';
import { createWalletClient, custom } from "viem";
import { goerli } from "viem/chains";

export default function Test() {
  const client = createWalletClient({
    chain: goerli,
    transport: custom((window as any).ethereum)
  })

  const test = async () => {
    const [address] = await client.getAddresses()
    alert(address)
  }

  return (
    <button onClick={test}>test</button>
  )
}