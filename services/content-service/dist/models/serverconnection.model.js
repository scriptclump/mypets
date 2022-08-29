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
exports.ServerConnection = void 0;
const mongoose_1 = require("mongoose");
const Function_1 = require("../util/Function");
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const ServerConnectionSchema = new mongoose_1.Schema({
    centreHost: { type: String },
    centrePort: { type: String },
    centreUsername: { type: String },
    centrePassword: { type: String },
    vProxyHost: { type: String },
    vProxyPort: { type: String },
    vProxyUsername: { type: String },
    vProxyPassword: { type: String },
    vProxyID: { type: String },
    vcIp: { type: String },
    vcUsername: { type: String },
    vcPassword: { type: String },
    vcPort: { type: String },
    vmIp: { type: String },
    vmUsername: { type: String },
    vmPassword: { type: String },
    vmPort: { type: String },
    vmId: { type: String },
}, { timestamps: true });
ServerConnectionSchema.pre("save", function save(next) {
    return __awaiter(this, void 0, void 0, function* () {
        // if (!this.isModified("centrePassword")) return next();
        try {
            this.centrePassword = Function_1.generatePassword(this.centrePassword);
            this.vProxyPassword = Function_1.generatePassword(this.vProxyPassword);
            this.vcPassword = Function_1.generatePassword(this.vcPassword);
            this.vmPassword = Function_1.generatePassword(this.vmPassword);
            return next();
        }
        catch (err) {
            return next(err);
        }
    });
});
ServerConnectionSchema.plugin(mongoose_delete_1.default, { indexFields: ["deleted"], deletedAt: true, overrideMethods: ["findOne"] });
ServerConnectionSchema.plugin(mongoose_paginate_v2_1.default);
exports.ServerConnection = mongoose_1.model("ServerConnection", ServerConnectionSchema, "server_connection");
//# sourceMappingURL=serverconnection.model.js.map