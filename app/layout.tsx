'use client';
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { optimismGoerli } from "wagmi/chains";
import { publicProvider } from 'wagmi/providers/public';
// import 'leaflet/dist/leaflet.css';

const { publicClient, webSocketPublicClient } = configureChains(
  [optimismGoerli],
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