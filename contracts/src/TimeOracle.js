var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { SmartContract, state, State, PublicKey, Field, Signature, method } from 'o1js';
const ORACLE_PUBLIC_KEY = "B62qiqNhiinraL2BhyfcLN5gaxBnKPbkMcpNrK14bkgLDihbTRN9Udv";
export class TimeOracle extends SmartContract {
    constructor() {
        super(...arguments);
        this.oraclePublicKey = State();
    }
    init() {
        super.init();
        this.oraclePublicKey.set(PublicKey.fromBase58(ORACLE_PUBLIC_KEY));
    }
    // オラクルから現在の時刻データを提供するメソッドなどを追加
    async verify(signature, startTime, endTime, targetStartTimestamp, targetEndTimestamp) {
        // オラクルの公開鍵を取得
        const oraclePublicKey = this.oraclePublicKey.get();
        // オラクルの公開鍵が正しいか確認
        this.oraclePublicKey.requireEquals(oraclePublicKey);
        const validSignature = signature.verify(oraclePublicKey, [startTime, endTime]);
        validSignature.assertTrue();
        // timestamp が startTime から endTime の範囲にあることを確認
        startTime.assertEquals(targetStartTimestamp);
        endTime.assertEquals(targetEndTimestamp);
    }
}
__decorate([
    state(PublicKey),
    __metadata("design:type", Object)
], TimeOracle.prototype, "oraclePublicKey", void 0);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Signature, Field, Field, Field, Field]),
    __metadata("design:returntype", Promise)
], TimeOracle.prototype, "verify", null);
//# sourceMappingURL=TimeOracle.js.map