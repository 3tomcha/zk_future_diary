import { SmartContract, State, PublicKey, Field, Signature } from 'o1js';
export declare class TimeOracle extends SmartContract {
    oraclePublicKey: State<PublicKey>;
    init(): void;
    verify(timestamp: Field, signature: Signature, startTime: Field, endTime: Field): Promise<void>;
}
