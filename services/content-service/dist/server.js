"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorhandler_1 = __importDefault(require("errorhandler"));
const app_1 = __importDefault(require("./app"));
const logger_1 = __importDefault(require("./util/logger"));
const mongo_1 = require("./config/mongo");
/**
 * Error Handler. Provides full stack
 */
if (process.env.NODE_ENV === "development") {
    app_1.default.use(errorhandler_1.default());
}
/**
 * Start Express server.
 */
const server = app_1.default.listen(app_1.default.get("port"), () => {
    logger_1.default.info(`App is running at http://localhost:${app_1.default.get("port")} in ${app_1.default.get("env")} mode`);
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongo_1.mongoBoot();
    }
    catch (e) {
        logger_1.default.error(`Error in booting the startup services ${e}`);
    }
}))();
exports.default = server;
//# sourceMappingURL=server.js.map