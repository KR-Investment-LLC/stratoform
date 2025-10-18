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

import { CompositeMap } from "./CompositeMap";
import { IComposite } from "./IComposite";
import { IConfig } from "./IConfig";
import { Resource } from "./Resource";

export abstract class ResourceComposite<C extends IConfig, D extends Resource<any>> extends Resource<C> implements IComposite<D> {
    private _composite: CompositeMap<this, D> = new CompositeMap<this, D>(this);

    addResource(resource: D): this { 
        this._composite.addResource(resource);
        return this;
    }

    removeResource(resource: D | string): D | undefined { 
        return this._composite.removeResource(resource); 
    }

    getResource(alias: string):  D | undefined { 
        return this._composite.getResource(alias); 
    }

    get resources(): Iterable<D> { 
        return this._composite.resources; 
    }
}