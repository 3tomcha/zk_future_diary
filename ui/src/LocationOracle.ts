import {
  Field,
  SmartContract,
  state,
  State,
  method,
  PublicKey,
  Signature,
  Struct,
} from 'o1js';

export class Point extends Struct({
  lat: Field,
  lng: Field,
}) { }

const ORACLE_PUBLIC_KEY = "B62qiqNhiinraL2BhyfcLN5gaxBnKPbkMcpNrK14bkgLDihbTRN9Udv"

export class LocationOracle extends SmartContract {
  @state(PublicKey) oraclePublicKey = State<PublicKey>();

  events = {
    verified: Field
  }

  init() {
    super.init()
    this.oraclePublicKey.set(PublicKey.fromBase58(ORACLE_PUBLIC_KEY))
    this.requireSignature();
  }
  @method async verify(userLocationLat: Field, userLocationLng: Field, signature: Signature) {
    const oraclePublicKey = this.oraclePublicKey.get()
    this.oraclePublicKey.requireEquals(oraclePublicKey)
    const validSignature = signature.verify(oraclePublicKey, [userLocationLat, userLocationLng, Field(1),])
    validSignature.assertTrue()
    this.emitEvent("verified", userLocationLat)
  }
}