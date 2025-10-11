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

import { IResourceComposite } from "./IResourceComposite.js"
import { IResourceConfig } from "./IResourceConfig.js";
import { IResourceDependent } from "./IResourceDependent.js";

export class ResourceComposite<D extends IResourceDependent<any>> implements IResourceComposite<D> {
    private _dependents: Map<string, D> = new Map<string, D>();
    private _parent:     IResourceComposite<any>;

    constructor(parent: IResourceComposite<any>) {
        this._parent = parent;
    }

    addDependant(dependant: D): D {
        this._dependents.set(dependant.name, dependant);
        dependant.parent = this._parent;
        return dependant;
    }

    removeDependant(dependant: string | D): D | undefined {
        const _key = (typeof dependant === "string")? dependant : dependant.name;
        const _dependant = this._dependents.get(_key);
        if(_dependant) _dependant.parent = undefined;
        return _dependant;
    }

    getDependant(name: string): D | undefined {
        return this._dependents.get(name);
    }

    get dependents(): MapIterator<D> {
        return this._dependents.values();
    }
}