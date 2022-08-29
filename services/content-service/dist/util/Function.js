"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePassword = exports.success = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const success = (message = "", data = {}) => {
    return { status: "success", message: message, data: data };
};
exports.success = success;
const generatePassword = (password) => {
    return crypto_js_1.default.AES.encrypt(password, process.env["SECRET_KEY_AES"]).toString();
};
exports.generatePassword = generatePassword;
//# sourceMappingURL=Function.js.map