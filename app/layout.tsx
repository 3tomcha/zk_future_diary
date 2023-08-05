'use client';
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiConfig config={config}>
      <html lang="ja">
        <head />
        <body>
          {children}
        </body>
      </html>
    </WagmiConfig>
  );
}