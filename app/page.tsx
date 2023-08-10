'use client';
import { useAccount, useConnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { IDKitWidget, CredentialType, ISuccessResult } from "@worldcoin/idkit"
import { useState } from 'react';
import { decode } from "./lib/wld"
import { createWalletClient, custom, createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import { ContractAbi } from "./abi/Contract.abi";
import { BigNumber } from '@ethersproject/bignumber';

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
        chain: sepolia,
        transport: custom((window as any).ethereum)
      })

      const merkleRoot = decode<BigNumber>('uint256', successResult.merkle_root);
      const nullifierHash = decode<BigNumber>('uint256', successResult.nullifier_hash);
      const proof = decode<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]>(
        'uint256[8]',
        successResult.proof
      )

      const merkleRootBigInt = BigInt(merkleRoot.toString());
      const nullifierHashBigInt = BigInt(nullifierHash.toString());
      const proofBigInt = proof.map(value => BigInt(value.toString()));

      console.log("cliked");
      const hash = await walletClient.writeContract({
        address: contractAddress,
        abi: ContractAbi,
        functionName: "verifyAndExecute",
        args: [address, merkleRootBigInt, nullifierHashBigInt, [proofBigInt[0], proofBigInt[1], proofBigInt[2], proofBigInt[3], proofBigInt[4], proofBigInt[5], proofBigInt[6], proofBigInt[7]]],
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
