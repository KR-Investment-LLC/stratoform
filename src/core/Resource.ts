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

import { AsyncEventEmitter } from "./AsyncEventEmitter";
import { Deployment } from "./Deployment";
import { IConfig } from "./IConfig";

/** 
 * Every resource has a name, config, and is an async event emitter. 
 */
export abstract class Resource<C extends IConfig, P extends Resource<any, any> = Resource<any, any>> extends AsyncEventEmitter {
    /** 
     * Event names the base class uses 
     */
    static readonly EVENTS = {
        define:           "define"           as const,
        beforeValidate:   "beforeValidate"   as const, 
        afterValidate:    "afterValidate"    as const,
        validationError:  "validationError"  as const,
        beforeSpecutlate: "beforeSpecutlate" as const,
        afterSpecutlate:  "afterSpecutlate"  as const,
        speculationError: "speculationError" as const,
        beforeDeploy:     "beforeDeploy"     as const,
        afterDeploy:      "afterDeploy"      as const,
        deploymentError:  "deploymentError"  as const
    };

    private _alias:  string;
    private _config: C;

    public parent: P | undefined = undefined;

    /**
     * @description
     * @param alias 
     * @param config 
     */
    constructor(alias: string, config: C) { 
        super(); 
        this._alias  = alias;
        this._config = config;
    }

    get alias(): string {
        return this._alias;
    }

    set alias(alias: string) {
        this._alias = alias;
    }

    get config(): C {
        return this._config;
    }

    set config(config: C) {
        this._config = config;
    }

    dependsOn(resourceOrDeployment: Resource<any> | Deployment<any>): this {
        return this;
    }

    /**
     * @description 
     * @param this 
     * @param name 
     * @param config 
     * @param fn 
     * @returns 
     */
    static define<TR extends Resource<any>, C>(this: new (alias: string, config: C) => TR, alias: string, config: C, fn?: (self: TR) => void | Promise<void> ): TR {
        const self = new this(alias, config);
        if(fn) self.on(Resource.EVENTS.define, () => fn(self));
        return self;
    }

    static lookup<TR extends Resource<any>, C>(): TR {
        return {} as TR;
    };
}