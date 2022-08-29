"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const serverconnection = __importStar(require("../controllers/serverconnection.controller"));
const express_1 = __importDefault(require("express"));
const serverconnection_validator_1 = require("../validators/serverconnection.validator");
const ErrorMiddleware_1 = require("../middlewares/ErrorMiddleware");
const router = express_1.default.Router();
router.post("/server-connection", serverconnection_validator_1.ServerConnectionCreateValidator, ErrorMiddleware_1.throwValidationError, serverconnection.create);
router.put("/server-connection/:id", serverconnection_validator_1.ServerConnectionUpdateValidator, ErrorMiddleware_1.throwValidationError, serverconnection.update);
router.get("/server-connection/:id", serverconnection_validator_1.ServerConnectionFindOneValidator, ErrorMiddleware_1.throwValidationError, serverconnection.findOne);
router.get("/server-connection", serverconnection_validator_1.ServerConnectionFindAllValidator, ErrorMiddleware_1.throwValidationError, serverconnection.findAll);
router.delete("/server-connection/:id", serverconnection_validator_1.ServerConnectionFindOneValidator, ErrorMiddleware_1.throwValidationError, serverconnection.deleteOne);
router.delete("/server-connection", serverconnection_validator_1.ServerConnectionDeleteAllValidator, ErrorMiddleware_1.throwValidationError, serverconnection.deleteAll);
router.post("/server-connection/proxy", serverconnection_validator_1.ServerConnectionFindProxyVMDataValidator, ErrorMiddleware_1.throwValidationError, serverconnection.findByProxyIdAndVmId);
module.exports = router;
//# sourceMappingURL=serverconnection.route.js.map