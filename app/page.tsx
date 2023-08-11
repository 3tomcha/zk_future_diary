'use client';
import { useAccount, useConnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { IDKitWidget, CredentialType, ISuccessResult } from "@worldcoin/idkit"
import { useState } from 'react';
import { decode } from "./lib/wld"
import { createWalletClient, custom, createPublicClient, http } from "viem";
import { optimismGoerli } from "viem/chains";
import { ContractAbi } from "./abi/Contract.abi";
import { BigNumber } from '@ethersproject/bignumber';

export default function Home() {
  const { address, isConnected } = useAccount();
  const [proof, setproof] = useState<ISuccessResult | null>(null);

  const contractAddress = "0x4251f93574d3f9CA3B1f82F5aD224d3490e4490C";

  const submit = async () => {
    if (!address) {
      await connect();
    }
    if (proof && address) {
      const walletClient = createWalletClient({
        chain: optimismGoerli,
        transport: custom((window as any).ethereum)
      })

      const publicClient = createPublicClient({
        chain: optimismGoerli,
        transport: http(),
      })

      const merkleRoot = decode<bigint>('uint256', proof.merkle_root);
      const nullifierHash = decode<bigint>('uint256', proof.nullifier_hash);
      const _proof = decode<[bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint]>(
        'uint256[8]',
        proof.proof
      )
      console.log(_proof[0]);
      console.log(_proof[1]);
      console.log(_proof[2]);
      console.log(_proof[3]);
      console.log(_proof[4]);
      console.log(_proof[5]);
      console.log(_proof[6]);
      console.log(_proof[7]);

      const { request } = await publicClient.simulateContract({
        address: contractAddress,
        abi: ContractAbi,
        functionName: "verifyAndExecute",
        args: [address, merkleRoot, nullifierHash, _proof],
        account: address,
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
    <> {proof && <div>{JSON.stringify(proof)}
      <button onClick={submit}>submit</button>
      <button onClick={handleConnect}>connect</button>
    </div>}
      <IDKitWidget
        app_id='app_staging_e1b76c940110a7556717585809b51fb1'
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
