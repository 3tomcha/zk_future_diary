'use client';
import { useAccount, useConnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { IDKitWidget, CredentialType, ISuccessResult } from "@worldcoin/idkit"
import { useState } from 'react';
import { decode } from "./lib/wld"
import { createWalletClient, custom, createPublicClient, http, parseAbiItem } from "viem";
import { optimismGoerli } from "viem/chains";
import { ContractAbi } from "./abi/Contract.abi";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [proof, setproof] = useState<ISuccessResult | null>(null);

  const contractAddress = "0x0B6DCf635578DFA52241D15fdD9Ed04Ca4425dc5";

  const submit = async () => {
    if (!address) {
      await connect();
    }
    if (proof && address) {
      const walletClient = createWalletClient({
        chain: optimismGoerli,
        transport: custom((window as any).ethereum),
      })

      const publicClient = createPublicClient({
        chain: optimismGoerli,
        transport: http(`https://opt-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
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
      const unwatch = publicClient.watchEvent({
        address: contractAddress,
        event: parseAbiItem(`event VerifiedAndExecuted(address indexed signal,uint256 indexed root,uint256 indexed nullifierHash,uint256[8] proof)`),
        onLogs: logs => console.log(logs)
      })
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
