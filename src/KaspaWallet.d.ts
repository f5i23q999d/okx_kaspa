import { BaseWallet, GetDerivedPathParam, NewAddressParams, ValidAddressParams, SignTxParams, CalcTxHashParams } from "@okxweb3/coin-base";
export declare class KaspaWallet extends BaseWallet {
    getDerivedPath(param: GetDerivedPathParam): Promise<any>;
    getNewAddress(param: NewAddressParams): Promise<any>;
    validAddress(param: ValidAddressParams): Promise<any>;
    signTransaction(param: SignTxParams): Promise<any>;
    calcTxHash(param: CalcTxHashParams): Promise<any>;
    signMessage(param: SignTxParams): Promise<any>;
}
