import { Field, PrivateKey, PublicKey, Signature, Mina, AccountUpdate, NetworkId } from 'o1js';
import { TimeOracle } from './TimeOracle';

let proofsEnabled = false;

describe('TimeOracle Smart Contract', () => {
  let oracle: TimeOracle;
  let oraclePrivateKey: PrivateKey;
  let oraclePublicKey: PublicKey;
  let signature: Signature;

  let deployerAccount: PublicKey,
    deployerKey: PrivateKey,
    senderAccount: PublicKey,
    senderKey: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey,
    zkApp: TimeOracle,
    chainid: NetworkId;

  beforeEach(async () => {
    const Local = await Mina.LocalBlockchain({ proofsEnabled });
    chainid = Local.getNetworkId();
    Mina.setActiveInstance(Local);
    deployerAccount = Local.testAccounts[0];
    deployerKey = Local.testAccounts[0].key;
    senderAccount = Local.testAccounts[1];
    senderKey = Local.testAccounts[1].key;
    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
    // zkAppPrivateKey = new PrivateKey(Scalar.from(process.env.PRIVATE_KEY ?? ""))
    // zkAppAddress = zkAppPrivateKey.toPublicKey();
    zkApp = new TimeOracle(zkAppAddress);
  });

  async function localDeploy() {
    const txn = await Mina.transaction(deployerAccount, async () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      // AccountUpdate.fundNewAccount(zkAppAddress)
      await zkApp.deploy();
    });
    console.log(txn)
    await txn.prove();
    // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
    await txn.sign([deployerKey, zkAppPrivateKey]).send();
  }

  describe('actual API requests', () => {
    it("succeed", async () => {
      await localDeploy()

      // 1時5分のタイムスタンプ（秒単位）
      const timestamp = Field(3600 * 1 + 5 * 60); // 1:05 = 1時 * 3600秒 + 5分 * 60秒

      const response = await fetch(
        `https://localhost:3000/api/time?timestamp=${timestamp.toString()}`,
      );
      const data = await response.json();
      console.log(data)

      const signature = Signature.fromBase58(data.signature);

      // 1時から2時の範囲
      const startTime = Field(BigInt(data.data.startTime)); // 1:00 = 1時 * 3600秒
      const endTime = Field(BigInt(data.data.endTime));   // 2:00 = 2時 * 3600秒

      console.log(`startTime: ${startTime}`);
      console.log(`endTime: ${endTime}`);
      const txn = await Mina.transaction(senderAccount, async () => {
        await zkApp.verify(
          timestamp,
          signature,
          startTime,
          endTime
        );
      });
      await txn.prove();
      await txn.sign([senderKey]).send();
    })
  })
})
