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

import { Dependent } from "./Dependent";
import { IComposite } from "./IComposite";
import { CompositeKernel } from "./CompositeKernel";
import { IConfig } from "./IConfig";

/** Dependent + Composite in one base. Any dependent can also own dependents. */
export abstract class DependentComposite<P, C extends IConfig, D extends Dependent<any, any>, E extends string = string> extends Dependent<P, C> implements IComposite<D> {
    private readonly composite = new CompositeKernel<this, D>(this);

    addResource(dependent: D): this {
        this.composite.addResource(dependent); return this;
    }

    removeResource(dependentOrName: D | string): D | undefined {
        return this.composite.removeResource(dependentOrName);
    }

    getResource(name: string): D | undefined {
        return this.composite.getResource(name);
    }

    get resources(): Iterable<D> {
        return this.composite.resources;
    }
}
