#!/usr/bin/env node
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

import { Command, Option } from "commander";

const program = new Command()
  .name("strato")
  .description("Run Stratoform deployments from *.stratoform.ts files")
  .version("0.1.0");

program
  .option("-p, --patterns <globs...>", "Glob(s) to find *.stratoform.ts", ["deployments/**/*.stratoform.ts"])
  .option("-C, --cwd <dir>", "Working directory", process.cwd())
  .addOption(
    new Option("--phase <names...>", "Lifecycle phase(s) to run")
      .choices(["define","beforeValidate","afterValidate","beforeSpecutlate","afterSpecutlate","beforeDeploy","afterDeploy"])
  )
  .option("--dry-run", "Resolve/validate only, don’t deploy", false)
  .option("-c, --concurrency <n>", "Max concurrent resources per phase", "0")
  .addOption(new Option("--format <fmt>", "Output format").choices(["table","json"]).default("table"))
  .option("-s, --select", "Interactive file selection", false)
  .option("-v, --verbose", "Verbose output", false);

program.parseAsync();
