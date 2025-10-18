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

import { IComposite } from "./IComposite";
import { Resource } from "./Resource";

/** 
 * Reusable manager for dependents; enforces parent wiring to Self. 
 */
export class CompositeMap<Owner extends Resource<any>, D extends Resource<any>> implements IComposite<D> {
    private readonly _resources = new Map<string, D>();
    private readonly _owner: Owner

    constructor(owner: Owner) {
        this._owner = owner;
    }

    addResource(resource: D): this {
        (resource as any).parent = this._owner;
        this._resources.set(resource.alias, resource);
        return this;
    }

    removeResource(resource: D | string): D | undefined {
        const _key      = typeof resource === "string" ? resource : resource.alias;
        const _existing = this._resources.get(_key);
        if(_existing) {
            this._resources.delete(_key);
            (_existing as any).parent = undefined as never;
        }
        return _existing;
    }

    getResource(alias: string): D | undefined {
        return this._resources.get(alias);
    }

    get resources(): Iterable<D> {
        return this._resources.values();
    }
}
