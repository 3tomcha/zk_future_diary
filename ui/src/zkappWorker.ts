import { Field, Mina, PublicKey, Signature, fetchAccount } from 'o1js';

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

import type { TimeOracle } from './TimeOracle';

const state = {
  TimeOracle: null as null | typeof TimeOracle,
  zkapp: null as null | TimeOracle,
  transaction: null as null | Transaction,
};

// ---------------------------------------------------------------------------------------

const functions = {
  setActiveInstanceToDevnet: async (args: {}) => {
    const Network = Mina.Network(
      'https://api.minascan.io/node/devnet/v1/graphql'
    );
    console.log('Devnet network instance configured.');
    Mina.setActiveInstance(Network);
    console.log(Mina.activeInstance)
  },
  loadContract: async (args: {}) => {
    const { TimeOracle } = await import('./TimeOracle.js');
    state.TimeOracle = TimeOracle;
  },
  compileContract: async (args: {}) => {
    await state.TimeOracle!.compile();
  },
  fetchAccount: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    return await fetchAccount({ publicKey });
  },
  initZkappInstance: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    state.zkapp = new state.TimeOracle!(publicKey);
  },
  createUpdateTransaction: async (args: {
    timestamp: any,
    signature: any,
    startTime: any,
    endTime: any
  }) => {
    console.log(args)
    const transaction = await Mina.transaction(async () => {
      await state.zkapp?.verify(
        Field(args.timestamp),
        Signature.fromBase58(args.signature),
        Field(args.startTime),
        Field(args.endTime)
      );
    });
    state.transaction = transaction;
  },
  proveUpdateTransaction: async (args: {}) => {
    await state.transaction!.prove();
  },
  getTransactionJSON: async (args: {}) => {
    return state.transaction!.toJSON();
  },
};

// ---------------------------------------------------------------------------------------

export type WorkerFunctions = keyof typeof functions;

export type ZkappWorkerRequest = {
  id: number;
  fn: WorkerFunctions;
  args: any;
};

export type ZkappWorkerReponse = {
  id: number;
  data: any;
};

if (typeof window !== 'undefined') {
  addEventListener(
    'message',
    async (event: MessageEvent<ZkappWorkerRequest>) => {
      const returnData = await functions[event.data.fn](event.data.args);

      const message: ZkappWorkerReponse = {
        id: event.data.id,
        data: returnData,
      };
      postMessage(message);
    }
  );
}

console.log('Web Worker Successfully Initialized.');