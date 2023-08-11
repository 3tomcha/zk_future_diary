import { createPublicClient, createWalletClient, custom, http } from "viem"
import { targetChain } from "../const/contract"

export default function useClient() {
  const publicClient = createPublicClient({
    chain: targetChain,
    transport: http(`https://opt-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
  })
  const walletClient = createWalletClient({
    chain: targetChain,
    transport: custom((window as any).ethereum),
  })

  return {
    publicClient,
    walletClient
  }
}
