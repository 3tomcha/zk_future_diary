import { LocationOracle } from './LocationOracle';
import {
  Field,
  Mina,
  PrivateKey,
  PublicKey,
  AccountUpdate,
  Signature,
  NetworkId,
  Scalar,
} from 'o1js';

let proofsEnabled = false;

describe('LocationOracle.js', () => {

  let deployerAccount: PublicKey,
    deployerKey: PrivateKey,
    senderAccount: PublicKey,
    senderKey: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey,
    zkApp: LocationOracle,
    chainid: NetworkId;

  beforeAll(async () => {
    if (proofsEnabled) await LocationOracle.compile();
  });

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
    // console.log(zkAppAddress)
    // zkAppPrivateKey = new PrivateKey(Scalar.from(process.env.PRIVATE_KEY ?? ""))
    // zkAppAddress = zkAppPrivateKey.toPublicKey();
    zkApp = new LocationOracle(zkAppAddress);
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
      //   {
      //     "lat": 35.66254,
      //     "lng": 139.732203
      // },
      const userLocationLat = 35.66254
      const userLocationLng = 139.732203
      const response = await fetch(
        `https://localhost:3000/api/position?lat=${userLocationLat}&lng=${userLocationLng}`,
      );
      const data = await response.json();
      console.log(data)
      // console.log(data.data)

      const signature = Signature.fromBase58(data.signature);

      const txn = await Mina.transaction(senderAccount, async () => {
        await zkApp.verify(Field(Math.ceil(userLocationLat * 10000)), Field(Math.ceil(userLocationLng * 10000)), signature);
      });
      await txn.prove();
      await txn.sign([senderKey]).send();

      const events = await zkApp.fetchEvents();
      const verifiedEventValue = Number(events[0].event.data.toFields(null)[0]);
      expect(verifiedEventValue).toEqual(Math.ceil(userLocationLat * 10000));
    })


  })
});
