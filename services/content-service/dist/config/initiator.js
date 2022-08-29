"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.includeFolder = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function includeFolder(folder, extension = ".js", excluded_file = []) {
    const files = fs_1.default.readdirSync(folder);
    if (files.length) {
        const config_files = files.map(function (file) {
            if (path_1.default.extname(file) === extension) {
                return path_1.default.basename(file, extension);
            }
        });
        if (config_files.length) {
            const config = {};
            config_files.forEach(function (file) {
                if (excluded_file.indexOf(file) == -1 && file)
                    config[file] = require(folder + file);
            });
            return config;
        }
        else {
            throw new Error("No Config Files Found");
        }
    }
    else {
        throw new Error("No Config Files Found");
    }
}
exports.includeFolder = includeFolder;
//# sourceMappingURL=initiator.js.map