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

import { Deployment } from "./Deployment";
import { IComposite } from "./IComposite";
import { Resource } from "./Resource";

/** 
 * Reusable manager for dependents; enforces parent wiring to Self. 
 */
export class CompositeMap<Owner extends Resource<any, any> | Deployment, D extends Resource<any, any> | Deployment> implements IComposite<D> {
    private readonly _resources    = new Map<string, D>();
    private readonly _owner: Owner

    constructor(owner: Owner) {
        this._owner = owner;
    }

    deployDependent(resource: D): this {
        resource.parent = this._owner;
        this._resources.set(resource.alias, resource);
        return this;
    }

    getDependent(alias: string): D | undefined {
        return this._resources.get(alias);
    }

    get dependents(): Iterable<D> {
        return this._resources.values();
    }

    async emit(event: string, ...args: any[]): Promise<void> {
        
        // const _listeners = this.listeners.get(event);

        // if(_listeners){
        //     for(const _listener of _listeners) {
        //         await _listener(...args);
        //     }
        // }
    }
}
