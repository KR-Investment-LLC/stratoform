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

import { AsyncEventEmitter } from "./AsyncEventEmitter";
import { IValidator } from "./IValidator"

export interface IVariableConfig<T> {
    value?:        T;
    defaultValue?: T ;
    required?:     boolean;
    secure?:       boolean;
    desscription?: string;
    validations?:  IValidator<T>[];
};

/**
 * 
 */
export class Variable<T, C extends IVariableConfig<T> = IVariableConfig<T>> extends AsyncEventEmitter {
    static EVENTS = {
        define:          "define"          as const,
        afterValueSet:   "afterValueSet"   as const,
        beforeValidate:  "beforeValidate"  as const,
        afterValidate:   "afterValidate"   as const,
        validationError: "validationError" as const
    };

    private _name:   string;
    private _config: C;

    constructor(name: string, config: C = {} as C) {
        super();
        this._name   = name;
        this._config = config;
    }

    get name(): string {
        return this._name;
    }

    get config(): C | undefined {
        return this._config;
    }

    set config(config: C) {
        this._config = config;
    }

    get value(): T | undefined {
        return this._config.value;
    }

    set value(value: T) {
        this._config.value = value;
    }

    static define<T, C extends IVariableConfig<T> = IVariableConfig<T>, TR extends Variable<T, C> = Variable<T, C>>(
            this: new (name: string, config?: C) => TR, name: string, config?: C, fn?: (self: TR) => void | Promise<void>): TR {
        const self = new this(name, config);
        if(fn) self.on(Variable.EVENTS.define, () => fn(self));
        return self;
    }
}