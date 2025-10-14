/*
 * MIT License
 *
 * Copyright (c) 2025 KRI, LLC
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import fs from "fs";
import path from "path";
import _ from "lodash";

export interface IRuntimeConfig {
    configPath?: string;
    pattern:     string;
    exclude?:    string[];
};

function createDefaultConfig(options: any): IRuntimeConfig {
    let _verbosity = options.silent;

    return {
        configPath: options.configPath,
        pattern: "**/*.strato.ts",
        exclude: [
            "**/node_modules"
        ]
    } as IRuntimeConfig;
}

function doesFileExist(configPath: string | undefined) {
    if(!configPath) return false;
    return fs.existsSync(path.resolve(configPath));
}

/**
 * 
 * @param options 
 * @returns 
 */
export function loadConfig(options: any): IRuntimeConfig {
    const _defaultConfig = createDefaultConfig(options);
    
    try {
        console.log(`Checking to see if '${_defaultConfig.configPath}' exists...`);
        // check to see if the file exists.
        if(doesFileExist(_defaultConfig.configPath)) {
            console.log(`'${_defaultConfig.configPath}' exists, loading config...`);
            const _content = fs.readFileSync(path.resolve(_defaultConfig.configPath!), "utf-8");
            const _data    = JSON.parse(_content);
            console.log(`'${_defaultConfig.configPath}' loaded.`);
            return _.merge({}, _defaultConfig, _data);
        }
    }
    catch(err) {
        console.error(`Exception loading config file '${_defaultConfig.configPath}': ${err}`);
        throw err;
    }

    console.log(`Config '${_defaultConfig.configPath}' does not exist, using default configuration.`);
    return _defaultConfig;
}