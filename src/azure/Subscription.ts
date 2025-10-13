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
import { Resource } from "../core/Resource";
import { ResourceGroup } from "./ResourceGroup";

/**
 * @description
 */
export enum WorkloadType {
    Production = "Production",
    DevTest    = "DevTest"
};

/**
 * 
 */
export interface ISubscriptionConfig extends IConfig {
    workloadType?: WorkloadType
}

/**
 * @description Marker class to identify dependents of a Subscription
 */
export abstract class SubscriptionDependant<C extends IConfig> extends Dependent<Subscription, C> {}

/**
 * 
 */
export class Subscription extends Resource<ISubscriptionConfig> implements IComposite<SubscriptionDependant<any>> {
    private readonly composite = new CompositeKernel<Subscription, SubscriptionDependant<any>>(this);

    addResourceGroup(resourceGroup: ResourceGroup): this {
        return this.addResource(resourceGroup);
    }

    addResource(resource: SubscriptionDependant<any>): this { 
        this.composite.addResource(resource);
        return this;
    }

    removeResource(resource: SubscriptionDependant<any> | string): SubscriptionDependant<any> | undefined { 
        return this.composite.removeResource(resource); 
    }

    getResource(alias: string):  SubscriptionDependant<any> | undefined { 
        return this.composite.getResource(alias); 
    }

    get resources(): Iterable<SubscriptionDependant<any>> { 
        return this.composite.resources; 
    }
}