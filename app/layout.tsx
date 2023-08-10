'use client';
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { polygonMumbai } from "wagmi/chains";
import { publicProvider } from 'wagmi/providers/public';

const { publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
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