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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerConnectionDeleteAllValidator = exports.ServerConnectionFindAllValidator = exports.ServerConnectionFindProxyVMDataValidator = exports.ServerConnectionFindOneValidator = exports.ServerConnectionUpdateValidator = exports.ServerConnectionCreateValidator = void 0;
const express_validator_1 = require("express-validator");
const Constants = __importStar(require("../config/constants"));
exports.ServerConnectionCreateValidator = [
    express_validator_1.body("centreHost").not().isEmpty().withMessage("centreHost cannot be empty"),
    express_validator_1.body("centrePort").not().isEmpty().withMessage("centrePort cannot be empty"),
    express_validator_1.body("centreUsername").not().isEmpty().withMessage("centreUsername cannot be empty"),
    express_validator_1.body("centrePassword").not().isEmpty().withMessage("centrePassword cannot be empty"),
    express_validator_1.body("vProxyHost").not().isEmpty().withMessage("vProxyHost cannot be empty"),
    express_validator_1.body("vProxyPort").not().isEmpty().withMessage("vProxyPort cannot be empty"),
    express_validator_1.body("vProxyUsername").not().isEmpty().withMessage("vProxyUsername cannot be empty"),
    express_validator_1.body("vProxyPassword").not().isEmpty().withMessage("vProxyPassword cannot be empty"),
    express_validator_1.body("vProxyID").not().isEmpty().withMessage("vProxyID cannot be empty"),
    express_validator_1.body("vcIp").not().isEmpty().withMessage("vcIp cannot be empty"),
    express_validator_1.body("vcUsername").not().isEmpty().withMessage("vcUsername cannot be empty"),
    express_validator_1.body("vcPassword").not().isEmpty().withMessage("vcPassword cannot be empty"),
    express_validator_1.body("vcPort").not().isEmpty().withMessage("vcPort cannot be empty"),
    express_validator_1.body("vmIp").not().isEmpty().withMessage("vmIp cannot be empty"),
    express_validator_1.body("vmUsername").not().isEmpty().withMessage("vmUsername cannot be empty"),
    express_validator_1.body("vmPassword").not().isEmpty().withMessage("vmPassword cannot be empty"),
    express_validator_1.body("vmPort").not().isEmpty().withMessage("vmPort cannot be empty"),
    express_validator_1.body("vmId").not().isEmpty().withMessage("vmId cannot be empty"),
];
exports.ServerConnectionUpdateValidator = [
    express_validator_1.check("id").not().isEmpty().withMessage("ID cannot be empty"),
    express_validator_1.body("centreHost").not().isEmpty().withMessage("centreHost cannot be empty"),
    express_validator_1.body("centrePort").not().isEmpty().withMessage("centrePort cannot be empty"),
    express_validator_1.body("centreUsername").not().isEmpty().withMessage("centreUsername cannot be empty"),
    express_validator_1.body("centrePassword").not().isEmpty().withMessage("centrePassword cannot be empty"),
    express_validator_1.body("vProxyHost").not().isEmpty().withMessage("vProxyHost cannot be empty"),
    express_validator_1.body("vProxyPort").not().isEmpty().withMessage("vProxyPort cannot be empty"),
    express_validator_1.body("vProxyUsername").not().isEmpty().withMessage("vProxyUsername cannot be empty"),
    express_validator_1.body("vProxyPassword").not().isEmpty().withMessage("vProxyPassword cannot be empty"),
    express_validator_1.body("vProxyID").not().isEmpty().withMessage("vProxyID cannot be empty"),
    express_validator_1.body("vcIp").not().isEmpty().withMessage("vcIp cannot be empty"),
    express_validator_1.body("vcUsername").not().isEmpty().withMessage("vcUsername cannot be empty"),
    express_validator_1.body("vcPassword").not().isEmpty().withMessage("vcPassword cannot be empty"),
    express_validator_1.body("vcPort").not().isEmpty().withMessage("vcPort cannot be empty"),
    express_validator_1.body("vmIp").not().isEmpty().withMessage("vmIp cannot be empty"),
    express_validator_1.body("vmUsername").not().isEmpty().withMessage("vmUsername cannot be empty"),
    express_validator_1.body("vmPassword").not().isEmpty().withMessage("vmPassword cannot be empty"),
    express_validator_1.body("vmPort").not().isEmpty().withMessage("vmPort cannot be empty"),
    express_validator_1.body("vmId").not().isEmpty().withMessage("vmId cannot be empty"),
];
exports.ServerConnectionFindOneValidator = [
    express_validator_1.check("id").not().isEmpty().withMessage("ID cannot be empty")
];
exports.ServerConnectionFindProxyVMDataValidator = [
    express_validator_1.body("proxyVMData").not().isEmpty().withMessage("proxyVMData cannot be empty"),
    express_validator_1.body("proxyVMData").isArray(),
    express_validator_1.body("proxyVMData.*.vmId").not().isEmpty().withMessage("proxyVMData.vmId cannot be empty"),
    express_validator_1.body("proxyVMData.*.vProxyID").not().isEmpty().withMessage("proxyVMData.vProxyID cannot be empty"),
];
exports.ServerConnectionFindAllValidator = [
    express_validator_1.check("type").optional().isIn([Constants.FLAGS.HARD_DELETE]).withMessage("please send the appropriate value"),
    express_validator_1.check("page").optional().isDecimal().withMessage("please send the approriate value")
];
exports.ServerConnectionDeleteAllValidator = [
    express_validator_1.check("type").optional().isIn([Constants.FLAGS.HARD_DELETE]).withMessage("please send the appropriate value")
];
//# sourceMappingURL=serverconnection.validator.js.map