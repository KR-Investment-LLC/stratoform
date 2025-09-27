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

import { DeploymentDefinition } from "./DeploymentDefinition.js";
import { ResourceDefinition } from "./ResourceDefinition.js";

let _deployments:         DeploymentDefinition[]      = [];
let _activeDeployment:    DeploymentDefinition | null = null;
let _activeResource:      ResourceDefinition   | null = null;
let _activeChildResource: ResourceDefinition   | null = null;

/**
 * 
 * @param name 
 * @param fn 
 * @returns 
 */
export function deploy(name: string, fn: (def: DeploymentDefinition) => void) {
  const d = new DeploymentDefinition(name);
  _deployments.push(d);
  _activeDeployment = d;
  fn(d);
  _activeDeployment = null;
  return d;
}

/**
 * 
 * @param opts 
 */
export function addProperty<T>(opts: { name: string; defaultValue?: T; validate?: ((v: T) => void)[] }) {
  if (!_activeDeployment) throw new Error("No active deployment");
  _activeDeployment.properties.set(opts.name, opts.defaultValue ?? null);
}

/**
 * 
 * @param original 
 * @param alias 
 */
export function addPropertyAlias(original: string, alias: string) {
  if (!_activeDeployment) throw new Error("No active deployment");
  const val = _activeDeployment.properties.get(original);
  _activeDeployment.properties.set(alias, val);
}

/**
 * 
 * @param name 
 * @param fn 
 */
export function resource<T extends ResourceDefinition>(
  name: string,
  fn: (res: T) => void
) {
  if (!_activeDeployment) throw new Error("No active deployment");
  const res = new (class extends ResourceDefinition {}) (name) as T;
  _activeDeployment.resources.set(name, res);
  _activeResource = res;
  fn(res);
  _activeResource = null;
}

/**
 * 
 * @param name 
 * @param resolver 
 */
export function lookup<T extends ResourceDefinition>(name: string, resolver: object) {
  if (!_activeDeployment) throw new Error("No active deployment");
  const res = new (class extends ResourceDefinition {})(name) as T;
  // attach resolver metadata
  (res as any).resolver = resolver;
  _activeDeployment.resources.set(name, res);
}

/**
 * 
 * @param target 
 */
export function dependsOn(target: string | ResourceDefinition | DeploymentDefinition) {
  if (!_activeResource) throw new Error("No active resource");
  (_activeResource as any).dependsOn ??= [];
  (_activeResource as any).dependsOn.push(target);
}

/**
 * 
 * @param event 
 * @param handler 
 */
export function on(event: string, handler: Function) {
  if (!_activeDeployment) throw new Error("No active deployment");
  const handlers = _activeDeployment.events.get(event) ?? [];
  handlers.push(handler);
  _activeDeployment.events.set(event, handlers);
}

/**
 * 
 * @param properties 
 * @param config 
 */
export async function release(properties?: Record<string, any>, config?: Record<string, any>) {

  for(const d of _deployments) {
    // resolve props
    for (const [k, v] of Object.entries(properties ?? {})) {
      d.properties.set(k, v);
    }

    // // run events
    // const beforeValidate = d.events.get("beforeValidate") ?? [];
    // for (const fn of beforeValidate) await fn(d);

    // const validate = d.events.get("validate") ?? [];
    // for (const fn of validate) await fn(d);

    // const deployFns = d.events.get("deploy") ?? [];
    // for (const fn of deployFns) await fn(d);

    // const releaseFns = d.events.get("release") ?? [];
    // for (const fn of releaseFns) await fn(d);
  }
}
