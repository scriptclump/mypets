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
exports.deleteAll = exports.deleteOne = exports.findAll = exports.findByProxyIdAndVmId = exports.findOne = exports.update = exports.create = void 0;
const logger_1 = __importDefault(require("../util/logger"));
const GeneralError_1 = require("../util/GeneralError");
const Function_1 = require("../util/Function");
const serverconnection_model_1 = require("../models/serverconnection.model");
const mongodb_1 = require("mongodb");
const ServerConnectionService = __importStar(require("../services/serverconnection.service"));
const Constants = __importStar(require("../config/constants"));
/**
 * Create Server Connection
 * @route POST /server-connection
 */
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ServerConnectionRecord = new serverconnection_model_1.ServerConnection(req.body);
        const result = yield ServerConnectionRecord.save();
        res.json(Function_1.success("server-connection created", result));
    }
    catch (error) {
        logger_1.default.error(error);
        next(error);
    }
});
exports.create = create;
/**
 * Update Server Connection
 * @route PUT /server-connection/:id
 */
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const server_connection = yield ServerConnectionService.getServerConnection(id);
        const server_connection_record = req.body;
        server_connection_record.centrePassword = Function_1.generatePassword(server_connection.centrePassword);
        server_connection_record.vProxyPassword = Function_1.generatePassword(server_connection.vProxyPassword);
        server_connection_record.vcPassword = Function_1.generatePassword(server_connection.vcPassword);
        server_connection_record.vmPassword = Function_1.generatePassword(server_connection.vmPassword);
        yield serverconnection_model_1.ServerConnection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: server_connection_record });
        const record = Object.assign({}, Object.assign(Object.assign({}, server_connection_record), { _id: id }));
        res.json(Function_1.success("server-connection updated", record));
    }
    catch (error) {
        logger_1.default.error(error);
        next(error);
    }
});
exports.update = update;
/**
 * FindOne Server Connection
 * @route GET /server-connection/:id
 */
const findOne = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const server_connection = yield ServerConnectionService.getServerConnection(id);
        res.json(Function_1.success("server-connection found", server_connection));
    }
    catch (error) {
        logger_1.default.error(error);
        next(error);
    }
});
exports.findOne = findOne;
/**
 * Find Server Connection By Proxy and VmId
 * @route POST /server-connection/proxy
 */
const findByProxyIdAndVmId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { proxyVMData } = req.body;
        const server_connection = yield ServerConnectionService.getServerConnectionByProxyIdAndVmId(proxyVMData);
        res.json(Function_1.success("server-connection found", server_connection));
    }
    catch (error) {
        logger_1.default.error(error);
        next(error);
    }
});
exports.findByProxyIdAndVmId = findByProxyIdAndVmId;
/**
 * Find Server Connection
 * @route GET /server-connection/
 */
const findAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, type } = req.query;
        let data = [];
        if (page === undefined) {
            if (type && type === Constants.FLAGS.HARD_DELETE) {
                data = yield serverconnection_model_1.ServerConnection.find({}).sort({ _id: -1 });
            }
            else {
                data = yield serverconnection_model_1.ServerConnection.find({ deleted: false }).sort({ _id: -1 });
            }
        }
        else {
            if (type && type === Constants.FLAGS.HARD_DELETE) {
                data = yield serverconnection_model_1.ServerConnection.paginate({}, { sort: { _id: -1 }, page: page, limit: Constants.PAGINATION.LIMIT, useCustomCountFn: "countWithDeleted" });
            }
            else {
                data = yield serverconnection_model_1.ServerConnection.paginate({ deleted: false }, { sort: { _id: -1 }, page: page, limit: Constants.PAGINATION.LIMIT });
            }
        }
        console.log(data, "data");
        res.json(Function_1.success("server-connection found", data));
    }
    catch (error) {
        logger_1.default.error(error);
        next(error);
    }
});
exports.findAll = findAll;
/**
 * hard delete one Server Connection
 * @route DELETE /server-connection/:id
 */
const deleteOne = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { type } = req.body;
        const server_connection = yield ServerConnectionService.getServerConnection(id);
        let status;
        if (type && type === Constants.FLAGS.HARD_DELETE) {
            status = yield serverconnection_model_1.ServerConnection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
        }
        else {
            status = yield server_connection.delete();
        }
        if (status) {
            if (status["deletedCount"] || status["deleted"]) {
                res.json(Function_1.success("server-connection deleted"));
            }
            else {
                throw new GeneralError_1.BadRequest("unable to delete server-connection");
            }
        }
    }
    catch (error) {
        logger_1.default.error(error);
        next(error);
    }
});
exports.deleteOne = deleteOne;
/**
 * hard delete all Server Connection
 * @route DELETE /server-connection
 */
const deleteAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.body;
        let status;
        if (type && type === Constants.FLAGS.HARD_DELETE) {
            status = yield serverconnection_model_1.ServerConnection.deleteMany({});
        }
        else {
            status = yield serverconnection_model_1.ServerConnection.delete();
        }
        console.log(status, "status");
        if (status) {
            if (status["deletedCount"] || status["nModified"]) {
                res.json(Function_1.success("server-connection deleted"));
            }
            else {
                throw new GeneralError_1.BadRequest("unable to delete server-connection");
            }
        }
    }
    catch (error) {
        logger_1.default.error(error);
        next(error);
    }
});
exports.deleteAll = deleteAll;
//# sourceMappingURL=serverconnection.controller.js.map