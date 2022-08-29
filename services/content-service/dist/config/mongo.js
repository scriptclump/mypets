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
exports.MONGO_CONNECTION_STATUS = exports.mongoBoot = void 0;
const environment_1 = require("./environment");
const logger_1 = __importDefault(require("../util/logger"));
const mongoose_1 = __importDefault(require("mongoose"));
const bluebird_1 = __importDefault(require("bluebird"));
let MONGODB_URI;
if (environment_1.PROD) {
    MONGODB_URI = process.env["MONGODB_URI_PROD"];
}
else if (environment_1.STAGING) {
    MONGODB_URI = process.env["MONGODB_URI_STAGING"];
}
else {
    MONGODB_URI = process.env["MONGODB_URI_DEV"];
}
if (!MONGODB_URI) {
    if (environment_1.PROD) {
        logger_1.default.error("No mongo connection string. Set MONGODB_URI_PROD environment variable.");
    }
    else if (environment_1.STAGING) {
        logger_1.default.error("No mongo connection string. Set MONGODB_URI_STAGING environment variable.");
    }
    else {
        logger_1.default.error("No mongo connection string. Set MONGODB_URI_DEV environment variable.");
    }
}
mongoose_1.default.Promise = bluebird_1.default;
// mongoose.set("debug", true);
let MONGO_CONNECTION_STATUS = false;
exports.MONGO_CONNECTION_STATUS = MONGO_CONNECTION_STATUS;
function mongoBoot() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
            exports.MONGO_CONNECTION_STATUS = MONGO_CONNECTION_STATUS = true;
            logger_1.default.info("MongoDB is connected");
        }
        catch (e) {
            logger_1.default.error(`MongoDB connection error : ${e}`);
            exports.MONGO_CONNECTION_STATUS = MONGO_CONNECTION_STATUS = false;
            setTimeout(yield mongoBoot, 3000);
        }
    });
}
exports.mongoBoot = mongoBoot;
//# sourceMappingURL=mongo.js.map