'use client';
import { useAccount, useConnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { IDKitWidget, CredentialType } from "@worldcoin/idkit"

export default function Home() {
  const { address, isConnected } = useAccount();

  const { connect } = useConnect({
    connector: new InjectedConnector
  });

  if (isConnected) {
    return (<div>connected to {address}</div>)
  }

  const onSuccess = () => {
    console.log('success')
  }

  return (
    <IDKitWidget
      app_id='app_GBkZ1KlVUdFTjeMXKlVUdFT'
      action="claim_nft"
      signal={address}
      onSuccess={onSuccess}
      credential_types={[CredentialType.Orb]}
      enableTelemetry
    >
      {({ open }) => <button onClick={open}>Verify with World ID</button>}
    </IDKitWidget>
  )
}
