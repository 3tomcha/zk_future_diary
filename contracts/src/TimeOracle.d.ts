import { SmartContract, State, PublicKey, Field, Signature } from 'o1js';
export declare class TimeOracle extends SmartContract {
    oraclePublicKey: State<PublicKey>;
    init(): void;
    verify(signature: Signature, startTime: Field, endTime: Field, targetStartTimestamp: Field, targetEndTimestamp: Field): Promise<void>;
}
