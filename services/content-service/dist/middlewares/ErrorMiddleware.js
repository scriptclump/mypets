"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwValidationError = exports.ErrorMiddleware = void 0;
const express_validator_1 = require("express-validator");
const GeneralError_1 = require("../util/GeneralError");
const ErrorMiddleware = (err, req, res, next) => {
    if (err instanceof GeneralError_1.GeneralError) {
        return res.status(err.getCode()).json({
            status: "error",
            message: err.message
        });
    }
    return res.status(500).json({
        status: "error",
        message: err.message
    });
};
exports.ErrorMiddleware = ErrorMiddleware;
const throwValidationError = (req, res, next) => {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            status: "error",
            errors: errors.array()
        });
    }
    next();
};
exports.throwValidationError = throwValidationError;
//# sourceMappingURL=ErrorMiddleware.js.map