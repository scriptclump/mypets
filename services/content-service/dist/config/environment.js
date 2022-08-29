"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEV = exports.STAGING = exports.PROD = exports.ENVIRONMENT = void 0;
const logger_1 = __importDefault(require("../util/logger"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
if (fs_1.default.existsSync(".env")) {
    logger_1.default.debug("Using .env file to supply config environment variables");
    dotenv_1.default.config({ path: ".env" });
}
else {
    logger_1.default.debug("Using .env.example file to supply config environment variables");
    dotenv_1.default.config({ path: ".env.example" });
}
exports.ENVIRONMENT = process.env.NODE_ENV || "development";
exports.PROD = exports.ENVIRONMENT === "production";
exports.STAGING = exports.ENVIRONMENT === "staging";
exports.DEV = exports.ENVIRONMENT === "development";
//# sourceMappingURL=environment.js.map