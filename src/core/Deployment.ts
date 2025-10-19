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
import { CompositeMap } from "./CompositeMap";
import { Dependable, IDependable } from "./Dependable";
import { Resource } from "./Resource";
import { Variable } from "./Variable";

export const DEPLOYMENT_VERSION = Symbol.for("Stratoform.Deployment/v1.0.0");

/** 
 * Event names the base class uses 
 */
export const DeploymentEvents = {
    beforeValidate:   "beforeValidate"   as const, 
    validate:         "validate"         as const,
    afterValidate:    "afterValidate"    as const,
    validationError:  "validationError"  as const,
    beforeSpecutlate: "beforeSpecutlate" as const,
    specutlate:       "specutlate"       as const,
    afterSpecutlate:  "afterSpecutlate"  as const,
    speculationError: "speculationError" as const,
    beforeDeploy:     "beforeDeploy"     as const,
    deploy:           "deploy"           as const,
    afterDeploy:      "afterDeploy"      as const,
    deploymentError:  "deploymentError"  as const
};

/**
 * @description
 */
export interface IDeploymentConfig {
    name?: string
};

/**
 * @description
 */
export class Deployment<C extends IDeploymentConfig = IDeploymentConfig> extends AsyncEventEmitter implements IDependable {
    public readonly [DEPLOYMENT_VERSION] = true;

    private _resources               = new CompositeMap<this, Resource<any, any>>(this);
    private _variables               = new Map<string, Variable<any>>();
    private _deployments             = new CompositeMap<this, Deployment>(this);
    private _dependable:  Dependable = new Dependable();
    private _alias:       string;
    private _config:      C;

    public parent: Deployment | undefined; // Will be set and enforced during deployment operations.

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

    deployResource(resource: Resource<any, any>): this {
        this._resources.deployDependent(resource);
        return this;
    }

    getResource(alias: string): Resource<any, any> | undefined {
        return this._resources.getDependent(alias);
    }

    get resources(): Iterable<Resource<any, any>> {
        return this._resources.dependents;
    }

    addVariable(variable: Variable<any>): this {
        this._variables.set(variable.name, variable);
        return this;
    }
    getVariable(name: string): Variable<any> | undefined {
        return this._variables.get(name);
    }

    get variables(): Iterable<Variable<any>> {
        return this._variables.values();
    }

    addDeployment(deployment: Deployment<any>): this {
        this._deployments.deployDependent(deployment);
        return this;
    }

    getDeployment(name: string): Deployment<any> | undefined {
        return this._deployments.getDependent(name);
    }

    get deployments(): Iterable<Deployment<any>> {
        return this._deployments.dependents;
    }

    dependsOn(...items: IDependable[]): void {
        this._dependable.dependsOn(...items);
    }

    async ready(): Promise<void> {
        return this._dependable.ready();
    }

    async resolve(): Promise<void> {
        return this._dependable.resolve();
    }

    /**
     * @description 
     * @param this 
     * @param name 
     * @param config 
     * @param fn 
     * @returns 
     */
    static deploy<TR extends Deployment<any>, C>(this: new (alias: string, config: C) => TR, alias: string, config: C, fn?: (self: TR) => void | Promise<void> ): TR {
        const _instance = new this(alias, config);
        if(fn) _instance.on(DeploymentEvents.deploy, () => fn(_instance));
        return _instance;
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