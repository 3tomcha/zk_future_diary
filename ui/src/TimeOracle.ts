import { SmartContract, state, State, PublicKey, Field, Signature, method } from 'o1js';

const ORACLE_PUBLIC_KEY = "B62qiqNhiinraL2BhyfcLN5gaxBnKPbkMcpNrK14bkgLDihbTRN9Udv";

export class TimeOracle extends SmartContract {
  @state(PublicKey) oraclePublicKey = State<PublicKey>();

  init() {
    super.init();
    this.oraclePublicKey.set(PublicKey.fromBase58(ORACLE_PUBLIC_KEY));
  }

  // オラクルから現在の時刻データを提供するメソッドなどを追加
  @method async verify(timestamp: Field, signature: Signature, startTime: Field, endTime: Field) {
    // オラクルの公開鍵を取得
    const oraclePublicKey = this.oraclePublicKey.get();
    // オラクルの公開鍵が正しいか確認
    this.oraclePublicKey.requireEquals(oraclePublicKey);

    const validSignature = signature.verify(oraclePublicKey, [startTime, endTime]);
    validSignature.assertTrue();

    // timestamp が startTime から endTime の範囲にあることを確認
    timestamp.assertGreaterThanOrEqual(startTime);
    timestamp.assertLessThan(endTime);
  }
}
