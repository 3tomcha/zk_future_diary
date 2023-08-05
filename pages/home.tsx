'use client';
import { useAccount, useConnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector
  });

  if (isConnected) {
    return (<div>connected to {address}</div>)
  }

  return (
    <button onClick={() => connect()}>Connect</button>
  )
}
