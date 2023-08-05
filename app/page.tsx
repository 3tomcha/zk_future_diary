'use client';
import { useAccount, useConnect, usePrepareContractWrite } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
// import ContractAbi from '../abi/Contract.abi'

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector
  });

  const { config } = usePrepareContractWrite({
    address: "0x05C4AE6bC33e6308004a47EbFa99E5Abb4133f86", //goerli testnet
    // abi: ContractAbi,
  })
  if (isConnected) {
    return (<div>connected to {address}</div>)
  }

  return (
    <button onClick={() => connect()}>Connect</button>
  )
}
