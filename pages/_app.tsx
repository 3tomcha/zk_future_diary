'use client';
import type { AppProps } from "next/app";
import { configureChains, createConfig, mainnet, WagmiConfig } from "wagmi";
import { publicProvider } from 'wagmi/providers/public';

const { publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()]
)

const config = createConfig({
  publicClient,
  webSocketPublicClient
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <Component {...pageProps} />
    </WagmiConfig>
  )
}