/// <reference types="node" />
type TransactionInput = {
    previousOutpoint: Outpoint;
    signatureScript: string;
    sequence: string | number;
    sigOpCount: number;
};
type Outpoint = {
    transactionId: string;
    index: number;
};
type TransactionOutput = {
    amount: string | number;
    scriptPublicKey: ScriptPublicKey;
};
type ScriptPublicKey = {
    version: number;
    scriptPublicKey: string;
};
export type Input = {
    txId: string;
    vOut: number;
    address: string;
    amount: string | number;
};
export type Output = {
    address: string;
    amount: string;
};
export type TxData = {
    inputs: Input[];
    outputs: Output[];
    address: string;
    fee: string;
    dustSize?: string;
};
export declare function transfer(txData: TxData, privateKey: string): string;
export declare function calcTxHash(tx: Transaction): string;
export declare function signMessage(message: string, privateKey: string): string;
export declare class Transaction {
    version: number;
    inputs: TransactionInput[];
    outputs: TransactionOutput[];
    lockTime: string;
    subnetworkId: string;
    utxos: {
        pkScript: Buffer;
        amount: string | number;
    }[];
    static fromTxData(txData: TxData): Transaction;
    constructor(txData: TxData);
    sign(privateKey: string): this;
    getMessage(): string;
}
export {};
