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
import { Resource } from "./Resource";
import { Variable } from "./Variable";

export const DEPLOYMENT_VERSION = Symbol.for("Stratoform.Deployment/v1.0.0");

/**
 * @description
 */
export interface IDeploymentConfig {
    name?: string
};

/**
 * @description
 */
export class Deployment<C extends IDeploymentConfig = IDeploymentConfig> extends AsyncEventEmitter {
    public readonly [DEPLOYMENT_VERSION] = true;

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

    private _resources:   Map<string, Resource<any>>   = new Map<string, Resource<any>>();
    private _variables:   Map<string, Variable<any>>   = new Map<string, Variable<any>>();
    private _deployments: Map<string, Deployment<any>> = new Map<string, Deployment<any>>();
    private _alias:       string;
    private _config:      C;

    constructor(alias: string, config: C) {
        super();
        this._alias = alias;
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

    addResource(resource: Resource<any>): this {
        this._resources.set(resource.alias, resource);
        return this;
    }

    removeResource(resource: Resource<any> | string): Resource<any> | undefined {
        const _key      = typeof resource === "string" ? resource : resource.alias;
        const _existing = this._resources.get(_key);
        if(_existing) this._resources.delete(_key);
        return _existing;
    }

    getResource(alias: string): Resource<any> | undefined {
        return this._resources.get(alias);
    }

    get resources(): Iterable<Resource<any>> {
        return this._resources.values();
    }

    addVariable(variable: Variable<any>): this {
        this._variables.set(variable.name, variable);
        return this;
    }

    removeVariable(variable: Variable<any> | string): Variable<any> | undefined {
        const _key      = typeof variable === "string" ? variable : variable.name;
        const _existing = this._variables.get(_key);
        if(_existing) this._variables.delete(_key);
        return _existing;
    }

    getVariable(name: string): Variable<any> | undefined {
        return this._variables.get(name);
    }

    get variables(): Iterable<Variable<any>> {
        return this._variables.values();
    }

    addDeployment(deployment: Deployment<any>): this {
        this._deployments.set(deployment.alias, deployment);
        return this;
    }

    removedeployment(deployment: Deployment<any> | string): Deployment<any> | undefined {
        const _key      = typeof deployment === "string" ? deployment : deployment.alias;
        const _existing = this._deployments.get(_key);
        if(_existing) this._deployments.delete(_key);
        return _existing;
    }

    getdeployment(name: string): Deployment<any> | undefined {
        return this._deployments.get(name);
    }

    get deployments(): Iterable<Deployment<any>> {
        return this._deployments.values();
    }

    /**
     * @description 
     * @param this 
     * @param name 
     * @param config 
     * @param fn 
     * @returns 
     */
    static define<TR extends Deployment<any>, C>(this: new (alias: string, config: C) => TR, alias: string, config: C, fn?: (self: TR) => void | Promise<void> ): TR {
        const _self = new this(alias, config);
        if(fn) _self.on(Deployment.EVENTS.define, () => fn(_self));
        return _self;
    }

    /**
     * 
     * @param x 
     * @returns 
     */
    static is(x: unknown): x is Deployment {
        return !!x && typeof x === "object" && DEPLOYMENT_VERSION in (x as object);
    }
}