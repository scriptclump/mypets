import fs from "fs";
import path from "path";

export function includeFolder(folder: any, extension = ".js", excluded_file: Array<string> = []) {
    const files = fs.readdirSync(folder);
    
    if(files.length) {
        const config_files = files.map(function(file) {
            if(path.extname(file) === extension) {
                return path.basename(file, extension);
            }
        });
        if(config_files.length) {
            const config = <any>{};
            config_files.forEach(function(file) {
                if (excluded_file.indexOf(file) == -1 && file)
                config[file] = require(folder + file);
            });
            return config;
        } else {
            throw new Error("No config files found");
        }
    } else {
        throw new Error("No config files found");
    }
}

