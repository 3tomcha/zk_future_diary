'use client';
import { useAccount, useConnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { IDKitWidget, CredentialType, ISuccessResult } from "@worldcoin/idkit"
import { useState } from 'react';
import { decode } from "./lib/wld"
import { createWalletClient, custom, createPublicClient, http } from "viem";
import { polygonMumbai } from "viem/chains";
import { ContractAbi } from "./abi/Contract.abi";
import { BigNumber } from '@ethersproject/bignumber';

export default function Home() {
  const { address, isConnected } = useAccount();
  const [proof, setproof] = useState<ISuccessResult | null>(null);

  const contractAddress = "0x3A6aF89597F566900B2774C60FF158ceb309ca03";

  const submit = async () => {
    if (!address) {
      await connect();
    }
    if (proof && address) {
      const walletClient = createWalletClient({
        chain: polygonMumbai,
        transport: custom((window as any).ethereum)
      })

      const merkleRoot = decode<BigNumber>('uint256', proof.merkle_root);
      const nullifierHash = decode<BigNumber>('uint256', proof.nullifier_hash);
      const _proof = decode<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]>(
        'uint256[8]',
        proof.proof
      )

      console.log("cliked");
      const hash = await walletClient.writeContract({
        address: contractAddress,
        abi: ContractAbi,
        functionName: "verifyAndExecute",
        args: [address, merkleRoot, nullifierHash, [proof.proof[0], proof.proof[1], proof.proof[2], proof.proof[3], proof.proof[4], proof.proof[5], proof.proof[6], proof.proof[7]]],
        account: address,
      })
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
    <> {proof && <div>{JSON.stringify(proof)}
      <button onClick={submit}>submit</button>
      <button onClick={handleConnect}>connect</button>
    </div>}
      <IDKitWidget
        app_id='app_staging_abe19aaaafb96a06a7c45fc82138fe88'
        action="test"
        signal={address}
        onSuccess={setproof}
        credential_types={[CredentialType.Orb]}
        enableTelemetry
      >
        {({ open }) => <button onClick={open}>Verify with World ID</button>}
      </IDKitWidget>
    </>
  )
}
