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
    configPath:       string;
    workingDirectory: string;
    pattern:          string;
    exclude:          string[];
    logging:    {
        level:      string;
        path:       string;
        console:    boolean;
        file:       boolean;
        zipArchive: boolean;
        maxSize:    string;
        maxDays:    string;
    },
    variablePath?: string;
    variables?:    Record<string, any>;
};

function createDefaultConfig(options: any): IRuntimeConfig {
    return {
        configPath:       options.configPath,
        workingDirectory: options.workingDirectory,
        pattern:          "**/*.strato.ts",
        exclude: [
            "**/node_modules/**",
            "**/dist/**",
            "**/build/**",
            "**/logs/**"
        ],
        logging: {
            path:      options.logPath,
            level:     options.logLevel,
            console:   (options.silent)? false : (options.logOutput === "both" || options.logOutput === "console"),
            file:      (options.logOutput === "both" || options.logOutput === "file"),
            zipArchive: options.logZip,
            maxSize:    options.logSize,
            maxDays:    options.logDays
        },
        variablePath: options.variablePath,
        variables: options.variables
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
    let _defaultConfig = createDefaultConfig(options);
    
    // check to see if the file exists.
    if(doesFileExist(_defaultConfig.configPath)) {
        const _content = fs.readFileSync(path.resolve(_defaultConfig.configPath!), "utf-8");
        const _data    = JSON.parse(_content);
        _defaultConfig = _.merge({}, _defaultConfig, _data);
    }

    // Check to see if there is a variable path set
    if(_defaultConfig.variablePath) {
        const _content = fs.readFileSync(path.resolve(_defaultConfig.variablePath!), "utf-8");
        const _data    = JSON.parse(_content);
        _defaultConfig.variables = _.merge({}, _defaultConfig.variables, _data);
    }

    return _defaultConfig;
}