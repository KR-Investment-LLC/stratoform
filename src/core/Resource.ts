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

import { IContext } from "../runtime/Context";
import { AsyncEventEmitter } from "./AsyncEventEmitter";
import { Deployment } from "./Deployment";
import { IConfig } from "./IConfig";
import { Dependable, IDependable } from "./Dependable";

/** 
 * @description Event names the base class uses 
 */
export const ResourceEvents = {
    beforeValidate:   "beforeValidate"   as const,     // (resource, deployment, context): Promise<void> : void
    validate:         "validate"         as const,     // (resource, deployment, context): Promise<void> : void
    afterValidate:    "afterValidate"    as const,     // (resource, deployment, context): Promise<void> : void
    validationError:  "validationError"  as const,     // (resource, error, deployment, context): Promise<void> : void
    beforeSpecutlate: "beforeSpecutlate" as const,     // (target, source, deployment, context): Promise<void> : void
    speculate:        "speculate"        as const,     // (target, source, deployment, context): Promise<void> : void
    afterSpecutlate:  "afterSpecutlate"  as const,     // (target, source, deployment, context): Promise<void> : void
    speculationError: "speculationError" as const,     // (target, source, error, deployment, context): Promise<void> : void
    beforeDeploy:     "beforeDeploy"     as const,     // (resource, operation, deployment, context, filter?: any): Promise<void> : void
    deploy:           "deploy"           as const,     // (resource, operation, deployment, context, filter?: any): Promise<void> : void
    afterDeploy:      "afterDeploy"      as const,     // (resource, operation, deployment, context, filter?: any): Promise<void> : void
    deploymentError:  "deploymentError"  as const,     // (resource, operation, error, deployment, context, filter?: any): Promise<void> : void
    /**
     * @description Listener: (resource, error, deployment, context): Promise<void> : void
     */
    error: "error" as const
};

/**
 * @description
 * @enum {string}
 */
export enum ResourceOperation {
    Create  = "Create",
    Read    = "Read",
    Modify  = "Modify",
    Destroy = "Destroy",
    Lookup  = "Lookup",
    Define  = "Define"
}

export type ResourceListener<TR extends Resource<any, any>> = 
        (resource: TR, deployment?: Deployment, context?: IContext) => Promise<void> | void;

export type ResourceErrorListener<TR extends Resource<any, any>> = 
        (resource: TR, error: any, deployment?: Deployment, context?: IContext) => Promise<void> | void;

export type SpeculateListener<TR extends Resource<any, any>> = 
        (target: TR, source: TR, deployment?: Deployment, context?: IContext) => Promise<void> | void;

export type SpeculateErrorListener<TR extends Resource<any, any>> = 
        (target: TR, source: TR, error: any, deployment?: Deployment, context?: IContext) => Promise<void> | void;

export type DeploymentListener<TR extends Resource<any, any>> = 
        (resource: TR, operation: ResourceOperation, deployment?: Deployment, context?: IContext, filter?: any) => Promise<void> | void;

export type DeploymentErrorListener<TR extends Resource<any, any>> = 
        (resource: TR, operation: ResourceOperation, error: any, deployment?: Deployment, context?: IContext, filter?: any) => Promise<void> | void;

/** 
 * @description Every resource has a name, config, and is an async event emitter. 
 */
export abstract class Resource<C extends IConfig, P extends Resource<any, any> | Deployment | undefined> extends AsyncEventEmitter implements IDependable {
    private __stateId:   string | undefined;
    private _alias:      string;
    private _config:     C;
    private _operation:  ResourceOperation = ResourceOperation.Define;
    private _dependable: Dependable = new Dependable();

    public parent: P | undefined; // Will be set and enforced during deployment operations.

    /**
     * @description
     * @param alias 
     * @param config 
     */
    constructor(alias: string, config: C) { 
        super(); 
        this._alias  = alias;
        this._config = config;

        // set up the callbacks for the resource operations.
        this.on(ResourceEvents.validate,  this.handleValidateEvent);
        this.on(ResourceEvents.speculate, this.handleSpeculateEvent);
        this.on(ResourceEvents.deploy,    this.dispatchDeploy);
    }

    async handleCreateEvent(resource: this, deployment: Deployment, context: IContext): Promise<void> {}

    async handleReadEvent(resource: this, deployment: Deployment, context: IContext): Promise<void> {}

    async handleModifyEvent(resource: this, deployment: Deployment, context: IContext): Promise<void> {}

    async handleDestroyEvent(resource: this, deployment: Deployment, context: IContext): Promise<void> {}

    async handleValidateEvent(resource: this, deployment: Deployment, context: IContext): Promise<void> {}

    async handleSpeculateEvent(resource: this, deployment: Deployment, context: IContext): Promise<void> {}

    async handleLookupEvent(resource: this, filter: any, deployment: Deployment, context: IContext): Promise<void> {}

    async dispatchDeploy(resource: this, operation: ResourceOperation, deployment: Deployment, context: IContext, filter?: any): Promise<void> {
        // Wait for all dependents to be resolved first.
        await this._dependable.resolve();

        // Disptach the deployment request to the correct handler.
        let _promise: Promise<void> | undefined;
        switch(operation) {
            case ResourceOperation.Create: 
                _promise = resource.handleCreateEvent(resource, deployment, context);
                break;
            case ResourceOperation.Read: 
                _promise = resource.handleReadEvent(resource, deployment, context);
                break;
            case ResourceOperation.Lookup: 
                _promise = resource.handleLookupEvent(resource, filter, deployment, context);
                break;
            case ResourceOperation.Modify: 
                _promise = resource.handleModifyEvent(resource, deployment, context);
                break;
            case ResourceOperation.Destroy: 
                _promise = resource.handleDestroyEvent(resource, deployment, context);
                break;
            default:
                throw new Error(`Unhandled operation '${operation}' in resource '${this._alias}'.`);
        }
        return _promise;
    }

    get stateId(): string | undefined {
        return this.__stateId;
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

    get operation(): ResourceOperation {
        return this._operation;
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
    static deploy<TR extends Resource<any, any>, C extends IConfig>(this: new (alias: string, config: C) => TR, alias: string, config: C, fn?: DeploymentListener<TR>): TR {
        const _instance = new this(alias, config);
        if(fn) _instance.on(ResourceEvents.deploy, fn);
        return _instance;
    }

    static lookup<TR extends Resource<any, any>, C>(): TR {
        return {} as TR;
    };
}