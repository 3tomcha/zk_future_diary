'use client';
import { useAccount, useConnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { IDKitWidget, CredentialType, ISuccessResult } from "@worldcoin/idkit"
import { useEffect, useState } from 'react';
import { utils } from 'ethers';
import { decode } from "./lib/wld"
import { createWalletClient, custom, createPublicClient, http } from "viem";
import { goerli } from "viem/chains";
import ContractAbi from "./abi/Contract.abi";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [successResult, setSuccessResult] = useState<ISuccessResult | null>(null);

  const contractAddress = "0x75CB0C5E5FF44F83854EE6C5245225a41F2EfB99";

  const submit = async () => {
    if (!address) {
      await connect();
    }
    if (successResult && address) {
      const walletClient = createWalletClient({
        chain: goerli,
        transport: custom((window as any).ethereum)
      })

      const publicClient = createPublicClient({
        chain: goerli,
        transport: http(),
      })

      const merkleRoot = decode<utils.BigNumber>('uint256', successResult.merkle_root);
      const nullifierHash = decode<utils.BigNumber>('uint256', successResult.nullifier_hash);
      const proof = decode<[utils.BigNumber, utils.BigNumber, utils.BigNumber, utils.BigNumber, utils.BigNumber, utils.BigNumber, utils.BigNumber, utils.BigNumbe]>(
        'uint256[8]',
        successResult.proof
      )
      const { request } = await publicClient.simulateContract({
        address: contractAddress,
        abi: ContractAbi,
        functionName: "verifyAndExecute",
        args: [address, merkleRoot, nullifierHash, proof],
      })
      const hash = await walletClient.writeContract(request)
      console.log(hash)
    }
  }

  const { connect } = useConnect({
    connector: new InjectedConnector
  });

  const handleConnect = async () => {
    await connect();
  }

  return (
    <> {successResult && <div>{JSON.stringify(successResult)}
      <button onClick={submit}>submit</button>
      <button onClick={handleConnect}>connect</button>
    </div>}
      <IDKitWidget
        app_id='app_staging_abe19aaaafb96a06a7c45fc82138fe88'
        action="test"
        signal={address}
        onSuccess={setSuccessResult}
        credential_types={[CredentialType.Orb]}
        enableTelemetry
      >
        {({ open }) => <button onClick={open}>Verify with World ID</button>}
      </IDKitWidget>
    </>
  )
}
