"use client"
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useAccount, useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

const DynamicMap = dynamic(() => import('../components/Map'), { ssr: false });

export default function MapPage() {
  const { address } = useAccount();

  const { connect } = useConnect({
    connector: new InjectedConnector
  });

  const handleConnect = async () => {
    await connect();
  }
  useEffect(() => {
    if (!address) {
      handleConnect();
    }
  }, [address])

  return (
    <>
      {address && <DynamicMap address={address} />}
    </>
  )
}