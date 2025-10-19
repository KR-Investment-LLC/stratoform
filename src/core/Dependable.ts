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
 * @description Anything that can be awaited to become "ready". 
 */
export interface IDependable {
    /** 
     * @description Register dependencies this instance must await before resolving. 
     */
     dependsOn(...items: IDependable[]): void;

    /** 
     * @description Resolves when this instance is fully ready. Safe to call multiple times.
     */
    ready(): Promise<void>;
}

/**
 * 
 */
export class Dependable implements IDependable {
    private _dependents:   IDependable[] = [];
    private resolveReady!: () => void;
    private _semaphore:    Promise<void>;

    constructor() {
        this._semaphore = new Promise<void>((resolve) => {
            this.resolveReady = resolve;
        });
    }

    dependsOn(...items: IDependable[]): void {
        this._dependents.push(...items);
    }

    async ready(): Promise<void> {
        return this._semaphore;
    }

    /**
     * @description Waits for all dependencies’ ready() gates, then opens this one.
     *              Acts purely as a semaphore — does not perform any business logic.
     */
    async resolve(): Promise<void> {
        await Promise.all(this._dependents.map((d) => d.ready()));
        this.resolveReady();
    }
}