"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KaspaWallet = void 0;
const coin_base_1 = require("@okxweb3/coin-base");
const address_1 = require("./address");
const transaction_1 = require("./transaction");
class KaspaWallet extends coin_base_1.BaseWallet {
    async getDerivedPath(param) {
        return `m/44'/111111'/0'/0/${param.index}`;
    }
    async getNewAddress(param) {
        return Promise.resolve({
            address: (0, address_1.addressFromPrvKey)(param.privateKey),
            publicKey: (0, address_1.pubKeyFromPrvKey)(param.privateKey),
        });
    }
    async validAddress(param) {
        return Promise.resolve({
            isValid: (0, address_1.validateAddress)(param.address),
            address: param.address,
        });
    }
    async signTransaction(param) {
        try {
            return Promise.resolve((0, transaction_1.transfer)(param.data, param.privateKey));
        }
        catch (e) {
            return Promise.reject(coin_base_1.SignTxError);
        }
    }
    async calcTxHash(param) {
        try {
            if (typeof param.data === "string") {
                return Promise.resolve((0, transaction_1.calcTxHash)(JSON.parse(param.data).transaction));
            }
            return Promise.resolve((0, transaction_1.calcTxHash)(param.data.transaction));
        }
        catch (e) {
            return Promise.reject(coin_base_1.CalcTxHashError);
        }
    }
    async signMessage(param) {
        try {
            return Promise.resolve((0, transaction_1.signMessage)(param.data.message, param.privateKey));
        }
        catch (e) {
            return Promise.reject(coin_base_1.SignTxError);
        }
    }
}
exports.KaspaWallet = KaspaWallet;
//# sourceMappingURL=KaspaWallet.js.map