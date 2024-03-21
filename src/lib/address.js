"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeAddress = exports.encodePubKeyAddress = void 0;
const validation_1 = require("./validation");
const convertBits_1 = require("./convertBits");
const base32 = __importStar(require("./base32"));
const crypto_lib_1 = require("@okxweb3/crypto-lib");
function encodePubKeyAddress(pubKey, prefix) {
    const eight0 = [0, 0, 0, 0, 0, 0, 0, 0];
    const prefixData = prefixToArray(prefix).concat([0]);
    const versionByte = 0;
    const pubKeyArray = Array.prototype.slice.call(crypto_lib_1.base.fromHex(pubKey), 0);
    const payloadData = (0, convertBits_1.convert)(new Uint8Array([versionByte].concat(pubKeyArray)), 8, 5, false);
    const checksumData = new Uint8Array(prefixData.length + payloadData.length + eight0.length);
    checksumData.set(prefixData);
    checksumData.set(payloadData, prefixData.length);
    checksumData.set(eight0, prefixData.length + payloadData.length);
    const polymodData = checksumToArray(polymod(checksumData));
    const payload = new Uint8Array(payloadData.length + polymodData.length);
    payload.set(payloadData);
    payload.set(polymodData, payloadData.length);
    return 'kaspa:' + base32.encode(payload);
}
exports.encodePubKeyAddress = encodePubKeyAddress;
function decodeAddress(address) {
    (0, validation_1.validate)(hasSingleCase(address), 'Mixed case');
    address = address.toLowerCase();
    const pieces = address.split(':');
    (0, validation_1.validate)(pieces.length === 2, 'Invalid format: ' + address);
    const prefix = pieces[0];
    (0, validation_1.validate)(prefix === 'kaspa', 'Invalid prefix: ' + address);
    const encodedPayload = pieces[1];
    const payload = base32.decode(encodedPayload);
    (0, validation_1.validate)(validChecksum(prefix, payload), 'Invalid checksum: ' + address);
    const convertedBits = (0, convertBits_1.convert)(payload.slice(0, -8), 5, 8, true);
    const versionByte = convertedBits[0];
    const hashOrPublicKey = convertedBits.slice(1);
    if (versionByte === 1) {
        (0, validation_1.validate)(264 === hashOrPublicKey.length * 8, 'Invalid hash size: ' + address);
    }
    else {
        (0, validation_1.validate)(256 === hashOrPublicKey.length * 8, 'Invalid hash size: ' + address);
    }
    const type = getType(versionByte);
    return {
        payload: Buffer.from(hashOrPublicKey),
        prefix,
        type,
    };
}
exports.decodeAddress = decodeAddress;
function hasSingleCase(string) {
    return string === string.toLowerCase() || string === string.toUpperCase();
}
function prefixToArray(prefix) {
    const result = [];
    for (let i = 0; i < prefix.length; i++) {
        result.push(prefix.charCodeAt(i) & 31);
    }
    return result;
}
function checksumToArray(checksum) {
    const result = [];
    for (let i = 0; i < 8; ++i) {
        result.push(checksum & 31);
        checksum /= 32;
    }
    return result.reverse();
}
function validChecksum(prefix, payload) {
    const prefixData = prefixToArray(prefix);
    const data = new Uint8Array(prefix.length + 1 + payload.length);
    data.set(prefixData);
    data.set([0], prefixData.length);
    data.set(payload, prefixData.length + 1);
    return polymod(data) === 0;
}
function getType(versionByte) {
    switch (versionByte & 120) {
        case 0:
            return 'pubkey';
        case 8:
            return 'scripthash';
        default:
            throw new Error('Invalid address type in version byte:' + versionByte);
    }
}
const GENERATOR1 = [0x98, 0x79, 0xf3, 0xae, 0x1e];
const GENERATOR2 = [0xf2bc8e61, 0xb76d99e2, 0x3e5fb3c4, 0x2eabe2a8, 0x4f43e470];
function polymod(data) {
    var c0 = 0, c1 = 1, C = 0;
    for (var j = 0; j < data.length; j++) {
        C = c0 >>> 3;
        c0 &= 0x07;
        c0 <<= 5;
        c0 |= c1 >>> 27;
        c1 &= 0x07ffffff;
        c1 <<= 5;
        c1 ^= data[j];
        for (var i = 0; i < GENERATOR1.length; ++i) {
            if (C & (1 << i)) {
                c0 ^= GENERATOR1[i];
                c1 ^= GENERATOR2[i];
            }
        }
    }
    c1 ^= 1;
    if (c1 < 0) {
        c1 ^= 1 << 31;
        c1 += (1 << 30) * 2;
    }
    return c0 * (1 << 30) * 4 + c1;
}
//# sourceMappingURL=address.js.map