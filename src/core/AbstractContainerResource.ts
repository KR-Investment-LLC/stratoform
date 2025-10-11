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

import { AbstractResource } from "./AbstractResource.js";
import { IResource } from "./IResource.js";
import { IResourceConfig } from "./IResourceConfig.js";
import { IResourceContainer } from "./IResourceContainer.js";
import { ResourceContainer } from "./ResourceContainer.js";

export abstract class AbstractContainerResource<C extends IResourceConfig> extends AbstractResource<C> implements IResourceContainer<any> {
    private _container: ResourceContainer<any>;

    constructor(name: string, renamable = true) {
       super(name, renamable);
       this._container = new ResourceContainer<any>(this);
    }

    addResource(resource: IResource<any>): IResource<any> {
        return this._container.addResource(resource);
    }

    removeResource(resource: string | IResource<any>): IResource<any> | undefined {
        return this._container.removeResource(resource);
    }

    getResource(resource: string): IResource<any> | undefined {
        return this._container.getResource(resource);
    }

    get resources(): MapIterator<IResource<any>> {
        return this._container.resources;
    }
}