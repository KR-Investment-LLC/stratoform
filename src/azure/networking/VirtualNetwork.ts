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

import { CompositeKernel } from "../../core/CompositeKernel";
import { Dependent } from "../../core/Dependent";
import { IComposite } from "../../core/IComposite";
import { IConfig } from "../../core/IConfig";
import { ResourceGroup, ResourceGroupDependant } from "../ResourceGroup";
import { Subnet } from "./Subnet";

/**
 * 
 */
export interface IVirtualNetworkConfig extends IConfig {
    
};

/**
 * @description Marker class to identify dependents of a VirtualNetwork
 */
export abstract class VirtualNetworkDependent<C extends IConfig> extends Dependent<VirtualNetwork, C> {}

/**
 * 
 */
export class VirtualNetwork  extends ResourceGroupDependant<IVirtualNetworkConfig> implements IComposite<VirtualNetworkDependent<any>> {
    private readonly composite = new CompositeKernel<VirtualNetwork, VirtualNetworkDependent<any>>(this);

    // Add subnet and NSG helper.
    addSubnet(subnet: Subnet): this {
        return this.addResource(subnet);
    }

    addResource(d: VirtualNetworkDependent<any>): this { 
        this.composite.addResource(d);
        return this;
    }

    removeResource(d: VirtualNetworkDependent<any> | string): VirtualNetworkDependent<any> | undefined { 
        return this.composite.removeResource(d); 
    }

    getResource(name: string):  VirtualNetworkDependent<any> | undefined { 
        return this.composite.getResource(name); 
    }

    get resources(): Iterable<VirtualNetworkDependent<any>> { 
        return this.composite.resources; 
    }
}