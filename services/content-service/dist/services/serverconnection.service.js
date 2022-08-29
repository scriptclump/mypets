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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerConnectionByProxyIdAndVmId = exports.getServerConnection = void 0;
const GeneralError_1 = require("../util/GeneralError");
const serverconnection_model_1 = require("../models/serverconnection.model");
const mongodb_1 = require("mongodb");
/**
 * Get Server Connection
 */
const getServerConnection = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const server_connection = yield serverconnection_model_1.ServerConnection.findOneWithDeleted({ _id: new mongodb_1.ObjectId(id) });
        if (!server_connection) {
            throw new GeneralError_1.BadRequest("server-connection id does not exists");
        }
        return server_connection;
    }
    catch (error) {
        throw error;
    }
});
exports.getServerConnection = getServerConnection;
/**
 * Get Server Connection
 */
const getServerConnectionByProxyIdAndVmId = (vProxyAndVMIDData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const server_connection = yield serverconnection_model_1.ServerConnection.find({
            $or: vProxyAndVMIDData
        });
        return server_connection;
    }
    catch (error) {
        throw error;
    }
});
exports.getServerConnectionByProxyIdAndVmId = getServerConnectionByProxyIdAndVmId;
//# sourceMappingURL=serverconnection.service.js.map