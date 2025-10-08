"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTwoFactorToken = exports.generateQRCode = exports.generateTwoFactorSecret = void 0;
const speakeasy_1 = __importDefault(require("speakeasy"));
const qrcode_1 = __importDefault(require("qrcode"));
const generateTwoFactorSecret = () => {
    return speakeasy_1.default.generateSecret({
        name: 'Password Generator',
        issuer: 'PasswordGen'
    });
};
exports.generateTwoFactorSecret = generateTwoFactorSecret;
const generateQRCode = async (secret) => {
    const otpauthUrl = speakeasy_1.default.otpauthURL({
        secret: secret,
        label: 'Password Generator',
        issuer: 'PasswordGen'
    });
    return await qrcode_1.default.toDataURL(otpauthUrl);
};
exports.generateQRCode = generateQRCode;
const verifyTwoFactorToken = (secret, token) => {
    return speakeasy_1.default.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token,
        window: 2 // Allow 2 time windows for clock skew
    });
};
exports.verifyTwoFactorToken = verifyTwoFactorToken;
//# sourceMappingURL=twoFactor.js.map