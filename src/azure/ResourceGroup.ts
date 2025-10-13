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

import { CompositeKernel } from "../core/CompositeKernel";
import { Dependent } from "../core/Dependent";
import { IComposite } from "../core/IComposite";
import { IConfig } from "../core/IConfig";
import { VirtualNetwork } from "./networking/VirtualNetwork";
import { SubscriptionDependant, Subscription } from "./Subscription";

/**
 * 
 */
export interface IResourceGroupConfig extends IConfig {
    //
};

/**
 * @description Marker class to identify dependents of a ResourceGroup
 */
export abstract class ResourceGroupDependant<C extends IConfig> extends Dependent<ResourceGroup, C> {}

/**
 * 
 */
export class ResourceGroup  extends SubscriptionDependant<IResourceGroupConfig> implements IComposite<ResourceGroupDependant<any>> {
    private readonly composite = new CompositeKernel<ResourceGroup, ResourceGroupDependant<any>>(this);

    addVirtualNetwork(vnet: VirtualNetwork): this {
        return this.addResource(vnet);
    }

    addResource(resource: ResourceGroupDependant<any>): this { 
        this.composite.addResource(resource);
        return this;
    }

    removeResource(resource: ResourceGroupDependant<any> | string): ResourceGroupDependant<any> | undefined { 
        return this.composite.removeResource(resource); 
    }

    getResource(alias: string):  ResourceGroupDependant<any> | undefined { 
        return this.composite.getResource(alias); 
    }

    get resources(): Iterable<ResourceGroupDependant<any>> { 
        return this.composite.resources; 
    }
}