var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, SmartContract, state, State, method, PublicKey, Signature, Struct, } from 'o1js';
export class Point extends Struct({
    lat: Field,
    lng: Field,
}) {
}
const ORACLE_PUBLIC_KEY = "B62qiqNhiinraL2BhyfcLN5gaxBnKPbkMcpNrK14bkgLDihbTRN9Udv";
export class LocationOracle extends SmartContract {
    constructor() {
        super(...arguments);
        this.oraclePublicKey = State();
        this.events = {
            verified: Field
        };
    }
    init() {
        super.init();
        this.oraclePublicKey.set(PublicKey.fromBase58(ORACLE_PUBLIC_KEY));
        this.requireSignature();
    }
    async verify(userLocationLat, userLocationLng, signature) {
        const oraclePublicKey = this.oraclePublicKey.get();
        this.oraclePublicKey.requireEquals(oraclePublicKey);
        const validSignature = signature.verify(oraclePublicKey, [userLocationLat, userLocationLng, Field(1),]);
        validSignature.assertTrue();
        this.emitEvent("verified", userLocationLat);
    }
}
__decorate([
    state(PublicKey),
    __metadata("design:type", Object)
], LocationOracle.prototype, "oraclePublicKey", void 0);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field, Field, Signature]),
    __metadata("design:returntype", Promise)
], LocationOracle.prototype, "verify", null);
//# sourceMappingURL=LocationOracle.js.map