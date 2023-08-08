'use client';
import { createWalletClient, custom, createPublicClient, http } from "viem";
import { goerli } from "viem/chains";
import ContractAbi from "../abi/Contract.abi";
import { useAccount, useConnect } from "wagmi";
import { InjectedConnector } from 'wagmi/connectors/injected'
import { decode } from "../lib/wld"
import { utils } from 'ethers';


export default function Test() {
  const { address, isConnected } = useAccount();
  const walletClient = createWalletClient({
    chain: goerli,
    transport: custom((window as any).ethereum)
  })

  const publicClient = createPublicClient({
    chain: goerli,
    transport: http(),
  })

  const { connect } = useConnect({
    connector: new InjectedConnector
  });

  const contractAddress = "0x75CB0C5E5FF44F83854EE6C5245225a41F2EfB99";

  const test = async () => {
    await connect()
    if (isConnected && address) {
      const _merkle_root = ""
      const _nullifier_hash = ""
      const _proof = ""

      const merkleRoot = decode<utils.BigNumber>('uint256', _merkle_root);
      const nullifierHash = decode<utils.BigNumber>('uint256', _nullifier_hash);
      const proof = decode<[utils.BigNumbe, utils.BigNumbe, utils.BigNumbe, utils.BigNumbe, utils.BigNumbe, utils.BigNumbe, utils.BigNumbe, utils.BigNumbe]>(
        'uint256[8]',
        _proof
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

  return (
    <button onClick={test}>test</button>
  )
}