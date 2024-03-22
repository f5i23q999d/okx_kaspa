"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAddress = exports.addressFromPrvKey = exports.addressFromPubKey = exports.pubKeyFromPrvKey = void 0;
const crypto_lib_1 = require("@okxweb3/crypto-lib");
const address_1 = require("./lib/address");
function pubKeyFromPrvKey(prvKey) {
    return crypto_lib_1.base.toHex(crypto_lib_1.signUtil.secp256k1.publicKeyCreate(crypto_lib_1.base.fromHex(prvKey), true).slice(1));
}
exports.pubKeyFromPrvKey = pubKeyFromPrvKey;
function addressFromPubKey(pubKey) {
    return (0, address_1.encodePubKeyAddress)(pubKey, "kaspa");
}
exports.addressFromPubKey = addressFromPubKey;
function addressFromPrvKey(prvKey) {
    return addressFromPubKey(pubKeyFromPrvKey(prvKey));
}
exports.addressFromPrvKey = addressFromPrvKey;
function validateAddress(address) {
    try {
        (0, address_1.decodeAddress)(address);
    }
    catch (e) {
        return false;
    }
    return true;
}
exports.validateAddress = validateAddress;
//# sourceMappingURL=address.js.map