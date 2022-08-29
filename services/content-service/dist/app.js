"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const lusca_1 = __importDefault(require("lusca"));
const path_1 = __importDefault(require("path"));
const ErrorMiddleware_1 = require("./middlewares/ErrorMiddleware");
const initiator_1 = require("./config/initiator");
const cors_1 = __importDefault(require("cors"));
// Create Express server
const app = express_1.default();
// Express configuration
app.set("port", process.env.PORT || 9000);
app.use(compression_1.default());
app.use(express_1.default.json());
app.use(cors_1.default());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(lusca_1.default.xframe("SAMEORIGIN"));
app.use(lusca_1.default.xssProtection(true));
const routes = Object.values(initiator_1.includeFolder(path_1.default.join(__dirname, "routes/")));
app.use(routes);
app.use(ErrorMiddleware_1.ErrorMiddleware);
exports.default = app;
//# sourceMappingURL=app.js.map