import { Field, SmartContract, State, PublicKey, Signature } from 'o1js';
declare const Point_base: (new (value: {
    lat: import("o1js/dist/node/lib/provable/field").Field;
    lng: import("o1js/dist/node/lib/provable/field").Field;
}) => {
    lat: import("o1js/dist/node/lib/provable/field").Field;
    lng: import("o1js/dist/node/lib/provable/field").Field;
}) & {
    _isStruct: true;
} & Omit<import("o1js/dist/node/lib/provable/types/provable-intf").Provable<{
    lat: import("o1js/dist/node/lib/provable/field").Field;
    lng: import("o1js/dist/node/lib/provable/field").Field;
}, {
    lat: bigint;
    lng: bigint;
}>, "fromFields"> & {
    fromFields: (fields: import("o1js/dist/node/lib/provable/field").Field[]) => {
        lat: import("o1js/dist/node/lib/provable/field").Field;
        lng: import("o1js/dist/node/lib/provable/field").Field;
    };
} & {
    fromValue: (value: {
        lat: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
        lng: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
    }) => {
        lat: import("o1js/dist/node/lib/provable/field").Field;
        lng: import("o1js/dist/node/lib/provable/field").Field;
    };
    toInput: (x: {
        lat: import("o1js/dist/node/lib/provable/field").Field;
        lng: import("o1js/dist/node/lib/provable/field").Field;
    }) => {
        fields?: Field[] | undefined;
        packed?: [Field, number][] | undefined;
    };
    toJSON: (x: {
        lat: import("o1js/dist/node/lib/provable/field").Field;
        lng: import("o1js/dist/node/lib/provable/field").Field;
    }) => {
        lat: string;
        lng: string;
    };
    fromJSON: (x: {
        lat: string;
        lng: string;
    }) => {
        lat: import("o1js/dist/node/lib/provable/field").Field;
        lng: import("o1js/dist/node/lib/provable/field").Field;
    };
    empty: () => {
        lat: import("o1js/dist/node/lib/provable/field").Field;
        lng: import("o1js/dist/node/lib/provable/field").Field;
    };
};
export declare class Point extends Point_base {
}
export declare class LocationOracle extends SmartContract {
    oraclePublicKey: State<PublicKey>;
    events: {
        verified: typeof import("o1js/dist/node/lib/provable/field").Field & ((x: string | number | bigint | import("o1js/dist/node/lib/provable/core/fieldvar").FieldConst | import("o1js/dist/node/lib/provable/core/fieldvar").FieldVar | import("o1js/dist/node/lib/provable/field").Field) => import("o1js/dist/node/lib/provable/field").Field);
    };
    init(): void;
    verify(userLocationLat: Field, userLocationLng: Field, signature: Signature): Promise<void>;
}
export {};
