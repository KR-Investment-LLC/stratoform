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

import { IResource, SupportedMethods } from "./IResource.js";
import { IResourceConfig } from "./IResourceConfig.js";
import { ResourceName } from "./ResourceName.js";

export abstract class AbstractResource<C extends IResourceConfig> implements IResource<C> {
    private   _name:            ResourceName;
    protected _method:          SupportedMethods           = SupportedMethods.Create;
    protected _resolved:        boolean                    = false;
    public    config:           C | undefined              = undefined;
    
    constructor(name: string, renamable = true) {
        this._name = new ResourceName(name, renamable);
    }

    get method(): SupportedMethods {
        return this._method;
    }

    get supportedMethods(): SupportedMethods[] {
        return [SupportedMethods.All];
    }

    get renamable(): boolean {
        return this._name.renamable;
    }

    get resolved(): boolean {
        return this._resolved;
    }

    get name(): string {
        return this._name.name;
    }

    set name(name: string) {
        this._name.name = name;
    }
}