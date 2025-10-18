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

import path from "node:path";
import { pathToFileURL } from "node:url";
import fg from "fast-glob";
import { AsyncEventEmitter } from "../core/AsyncEventEmitter";
import { IContext } from "./Context";
import { 
    Deployment, 
    DEPLOYMENT_VERSION 
} from "../core/Deployment";

/**
 * @description
 */
export interface IRuntime {
    readonly context: IContext;

    /**
     * @description
     */
    run(): Promise<void>;
}

/**
 * @description Factory method for creating a user-defined context.
 */
export type RuntimeFactory = (context: IContext) => BaseRuntime;

/**
 * 
 * @param x 
 * @returns 
 */
function isDeployment(x: unknown): x is Deployment {
  return !!x && typeof x === "object" && (DEPLOYMENT_VERSION in (x as object));
}

/**
 * @description
 */
export class BaseRuntime extends AsyncEventEmitter implements IRuntime {
    public _context!: IContext;

    private async loadDeployments() {
        // Find files by include/exclude paths
        const _files = await fg(this._context.config.pattern, {
            ignore:   this._context.config.exclude,
            cwd:      this._context.config.workingDirectory,
            absolute: true, // optional, returns full paths
        });

        // Loop through and load files default deployments
        for (const _file of _files) {
            this._context.log.debug(`Processing file '${_file}'...`);
            const _deployment: Deployment = await BaseRuntime.importDefault<Deployment>(_file, isDeployment);
            this._context.log.debug(`Adding deployment '${_deployment.alias}'.`);
            this._context.addDeployment(_deployment);
            this._context.log.debug(`'${_file}' processed.`);
        }
    }

    /**
     * 
     */
    async run(): Promise<void> {
        this._context.log.info(`Running stratoform in '${this._context.config.workingDirectory}'`);
        this._context.log.debug(`Using file pattern '${JSON.stringify(this._context.config.pattern)}'.`);
        this._context.log.debug(`Excluding file pattern '${JSON.stringify(this._context.config.exclude)}'.`);

        // Load the files.
        await this.loadDeployments();

        // start the event lifecycle.
    }

    /**
     * 
     */
    get context(): IContext {
        return this._context;
    }

    /**
     * @description
     * @param file 
     * @returns 
     */
    private static async importDefault<T extends Deployment>(file: string, isT: (v: unknown) => v is T): Promise<T> {
        const _url = pathToFileURL(path.resolve(file)).href;
        const _mod = await import(_url);
        if(!("default" in _mod))
            throw new Error(`No default export in ${file}`);
        let _val = (_mod as { default: unknown }).default;
        _val     = typeof _val === "function" ? await (_val as any)() : _val;
        if(!isT(_val)) {
            let preview = "";
            try { 
                preview = JSON.stringify(_val); 
            }
            catch { 
                preview = Object.prototype.toString.call(_val); 
            }
            throw new TypeError(
                `Default export in '${file}' is not a Deployment. ` +
                `Expected type ${String(DEPLOYMENT_VERSION)}. Got: ${preview}`
            );
        }
        return _val;
    }
}

/**
 * 
 * @param context 
 * @param factory 
 */
export function createRuntime(context: IContext, factory?: RuntimeFactory): IRuntime {
    const _runtime: BaseRuntime = (factory)? factory(context) : new BaseRuntime();
    _runtime._context = context;
    return _runtime;
}