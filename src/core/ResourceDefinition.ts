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

/**
 * 
 */
export enum SupportedMethods {
    Create,
    Read,
    List,
    Update, 
    Delete
};

export interface Properties {
    [key: string]: any;
}

/**
 * 
 */
export abstract class ResourceDefinition<P extends Properties> {
    private _name:       string;
    private _resolved:   boolean = false;
    private _method:     SupportedMethods | null = null;
    private _properties: P | null = null;

    /**
     * 
     * @param name 
     */
    constructor(name: string) {
        this._name = name;
    }

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        if(!this.isRenamable)
            throw new Error(`${this.constructor.name} cannot be re-named.`);
    }

    get properties() : P | null {
        return this._properties;
    }

    set properties(props: P) {
        this._properties = props;
    }

    get method(): SupportedMethods | null {
        return this._method;
    }

    set method(method: SupportedMethods | null) {
        if(method && !this.supportedMethods.includes(method))
            throw new Error(`Method ${method} is not supported. Supported: ${this.supportedMethods.join(", ")}`);
        this._method = method;
    }

    get supportedMethods(): SupportedMethods[] {
        return [
            SupportedMethods.Create,
            SupportedMethods.Read,
            SupportedMethods.List,
            SupportedMethods.Update, 
            SupportedMethods.Delete
        ] as SupportedMethods[];
    }

    get isRenamable(): boolean {
        return true;
    }
}

export interface ResourceDefinitionClass<T extends ResourceDefinition<any>> {
    new (...args: any[]): T; 
    creat(name: string): T;
}

/**
 * 
 * @param clazz 
 * @param name
 */
export function createResource<T extends ResourceDefinition<any>>(clazz: ResourceDefinitionClass<T>, name: string): T {
    return clazz.creat(name);
}