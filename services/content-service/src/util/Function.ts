import bcrypt from "bcrypt-nodejs";
import logger from "./logger";
import CryptoJS from "crypto-js";


export const success = (message: string = "", data: any = {}) => {
    return {status: "success", message: message, data: data};
};

export const generatePassword = (password: string) => {
    return CryptoJS.AES.encrypt(password, process.env["SECRET_KEY_AES"]).toString();
};