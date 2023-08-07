'use client';
import { useAccount, useConnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { IDKitWidget, CredentialType, ISuccessResult } from "@worldcoin/idkit"
import { useEffect, useState } from 'react';

export default function Home() {
  const { address, isConnected } = useAccount();
  const [proof, setProof] = useState<ISuccessResult | null>(null);

  const { connect } = useConnect({
    connector: new InjectedConnector
  });

  if (isConnected) {
    return (<div>connected to {address}</div>)
  }


  return (
    <> {proof && <div>{JSON.stringify(proof)}</div>}
      <IDKitWidget
        app_id='app_staging_abe19aaaafb96a06a7c45fc82138fe88'
        action="test"
        signal={address}
        onSuccess={setProof}
        credential_types={[CredentialType.Orb]}
        enableTelemetry
      >
        {({ open }) => <button onClick={open}>Verify with World ID</button>}
      </IDKitWidget>
    </>
  )
}
