/// <reference types="node" />
export declare function encodePubKeyAddress(pubKey: string, prefix: string): string;
export declare function decodeAddress(address: string): {
    payload: Buffer;
    prefix: string;
    type: string;
};
