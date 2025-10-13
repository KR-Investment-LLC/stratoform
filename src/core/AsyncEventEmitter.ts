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

type Settled = { status: "fulfilled" } | { status: "rejected"; reason: unknown };

export type Listener = (...args: any[]) => Promise<void> | void;

/**
 *  
 */
export class AsyncEventEmitter {
    private listeners: Map<string, Set<Listener>> = new Map();
    private _maxListeners = 50;

    setMaxListeners(n: number) {
        this._maxListeners = n;
        return this;
    }

    on(event: string, listener: Listener) {
      const bucket = this.listeners.get(event) ?? new Set<Listener>();
      if(bucket.size >= this._maxListeners) {
          // soft guard
          // console.warn(`Max listeners (${this._maxListeners}) for "${event}"`);
      }
      bucket.add(listener);
      this.listeners.set(event, bucket);
      return this;
    }

    once(event: string, listener: Listener) {
      const wrapped: Listener = async (...args: any[]) => {
          try { 
            await listener(...args); 
          } 
          finally {
              this.off(event, wrapped);
          }
      };
      return this.on(event, wrapped);
    }

    off(event: string, listener: Listener) {
        this.listeners.get(event)?.delete(listener);
        return this;
    }

    removeAllListeners(event?: string) {
        if(event) this.listeners.get(event)?.clear();
        else this.listeners.clear();
        return this;
    }

    async emit(event: string, ...args: any[]): Promise<Settled[]> {
        const fns = this.listeners.get(event);
        if(!fns || fns.size === 0) return [];
        const promises = Array.from(fns, fn => Promise.resolve().then(() => fn(...args)));
        const results = await Promise.allSettled(promises);
        return results.map(r =>
            (r.status === "fulfilled")? { status: "fulfilled" } : { status: "rejected", reason: r.reason }
        );
    }

    async emitSync(event: string, args: any[], stopOnError = false): Promise<Settled[]> {
        const fns = this.listeners.get(event);
        if(!fns || fns.size === 0) return [];
        const out: Settled[] = [];
        for (const fn of fns) {
          try {
              await fn(...args);
              out.push({ status: "fulfilled" });
          }
          catch(err) {
              out.push({ status: "rejected", reason: err });
              if(stopOnError) break;
          }
        }
        return out;
    }

    listenerCount(event: string): number {
        return this.listeners.get(event)?.size ?? 0;
    }
}
