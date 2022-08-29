import {
    body,
    check,
    validationResult
} from "express-validator";
import * as Constants from "../config/constants";

export const ContentCreateValidator = [
    body("centreHost").not().isEmpty().withMessage("centreHost cannot be empty"),
    body("centrePort").not().isEmpty().withMessage("centrePort cannot be empty"),
    body("centreUsername").not().isEmpty().withMessage("centreUsername cannot be empty"),
    body("centrePassword").not().isEmpty().withMessage("centrePassword cannot be empty"),
    body("vProxyHost").not().isEmpty().withMessage("vProxyHost cannot be empty"),
    body("vProxyPort").not().isEmpty().withMessage("vProxyPort cannot be empty"),
    body("vProxyUsername").not().isEmpty().withMessage("vProxyUsername cannot be empty"),
    body("vProxyPassword").not().isEmpty().withMessage("vProxyPassword cannot be empty"),
    body("vProxyID").not().isEmpty().withMessage("vProxyID cannot be empty"),
    body("vcIp").not().isEmpty().withMessage("vcIp cannot be empty"),
    body("vcUsername").not().isEmpty().withMessage("vcUsername cannot be empty"),
    body("vcPassword").not().isEmpty().withMessage("vcPassword cannot be empty"),
    body("vcPort").not().isEmpty().withMessage("vcPort cannot be empty"),
    body("vmIp").not().isEmpty().withMessage("vmIp cannot be empty"),
    body("vmUsername").not().isEmpty().withMessage("vmUsername cannot be empty"),
    body("vmPassword").not().isEmpty().withMessage("vmPassword cannot be empty"),
    body("vmPort").not().isEmpty().withMessage("vmPort cannot be empty"),
    body("vmId").not().isEmpty().withMessage("vmId cannot be empty"),
];

export const ContentUpdateValidator = [
    check("id").not().isEmpty().withMessage("ID cannot be empty"),
    body("centreHost").not().isEmpty().withMessage("centreHost cannot be empty"),
    body("centrePort").not().isEmpty().withMessage("centrePort cannot be empty"),
    body("centreUsername").not().isEmpty().withMessage("centreUsername cannot be empty"),
    body("centrePassword").not().isEmpty().withMessage("centrePassword cannot be empty"),
    body("vProxyHost").not().isEmpty().withMessage("vProxyHost cannot be empty"),
    body("vProxyPort").not().isEmpty().withMessage("vProxyPort cannot be empty"),
    body("vProxyUsername").not().isEmpty().withMessage("vProxyUsername cannot be empty"),
    body("vProxyPassword").not().isEmpty().withMessage("vProxyPassword cannot be empty"),
    body("vProxyID").not().isEmpty().withMessage("vProxyID cannot be empty"),
    body("vcIp").not().isEmpty().withMessage("vcIp cannot be empty"),
    body("vcUsername").not().isEmpty().withMessage("vcUsername cannot be empty"),
    body("vcPassword").not().isEmpty().withMessage("vcPassword cannot be empty"),
    body("vcPort").not().isEmpty().withMessage("vcPort cannot be empty"),
    body("vmIp").not().isEmpty().withMessage("vmIp cannot be empty"),
    body("vmUsername").not().isEmpty().withMessage("vmUsername cannot be empty"),
    body("vmPassword").not().isEmpty().withMessage("vmPassword cannot be empty"),
    body("vmPort").not().isEmpty().withMessage("vmPort cannot be empty"),
    body("vmId").not().isEmpty().withMessage("vmId cannot be empty"),
];

export const ContentFindOneValidator = [
    check("id").not().isEmpty().withMessage("ID cannot be empty")
];

export const ContentFindProxyVMDataValidator = [
    body("proxyVMData").not().isEmpty().withMessage("proxyVMData cannot be empty"),
    body("proxyVMData").isArray(),
    body("proxyVMData.*.vmId").not().isEmpty().withMessage("proxyVMData.vmId cannot be empty"),
    body("proxyVMData.*.vProxyID").not().isEmpty().withMessage("proxyVMData.vProxyID cannot be empty"),
];

export const ContentFindAllValidator = [
    check("type").optional().isIn([Constants.FLAGS.HARD_DELETE]).withMessage("please send the appropriate value"),
    check("page").optional().isDecimal().withMessage("please send the approriate value")
];

export const ContentDeleteAllValidator = [
    check("type").optional().isIn([Constants.FLAGS.HARD_DELETE]).withMessage("please send the appropriate value")
];
