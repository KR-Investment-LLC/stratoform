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

import { IResource } from "./IResource.js";
import { IResourceConfig } from "./IResourceConfig.js";
import { IResourceContainer } from "./IResourceContainer.js";

export class ResourceContainer<C extends IResourceConfig> implements IResourceContainer<C> {
    private _children: Map<string, IResource<any>> = new Map<string, IResource<any>>();
    private _parent:   IResource<any> | undefined;

    constructor(parent?: IResource<any>) {
        this._parent = parent;
    }

    addResource(resource: IResource<any>): IResource<any> {
        this._children.set(resource.name, resource);
        resource.parent = this._parent;
        return resource;
    }

    removeResource(resource: string | IResource<any>): IResource<any> | undefined {
        const _key = (typeof resource === "string")? resource : resource.name;
        const _child = this._children.get(_key);
        if(_child) _child.parent = undefined;
        return _child;
    }

    getResource(resource: string): IResource<any> | undefined {
        return this._children.get(resource);
    }

    get resources(): MapIterator<IResource<any>> {
        return this._children.values();
    }
}