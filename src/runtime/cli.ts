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

import { displayStartBanner } from "./banner";
import {
  IRuntimeConfig,
  loadConfig
} from "../core/RuntimeConfig";
import { 
  Command, 
  Option 
} from "commander";
import path from "node:path";

const program = new Command()
  .name("stratoform")
  .description("Run Stratoform cloud platform deployment definitions.")
  .version("0.1.0");

program
  .option("--config-path <path>",  "Stratoform config path [./statoconfig.json]",   path.join(process.cwd(), "statoconfig.json"))
  .option("--define",              "Only define infrastructure state.",             false)
  .addOption(
    new Option("--log-level <level>", "Set log verbosity")
      .choices(["verbose", "debug", "info", "warn", "error"])
      .default("info")
  )
  .option("--log-path",            "Only speculate infrastructure state.",          path.join(process.cwd(), "logs"))
  .option("--speculate",           "Only speculate infrastructure state.",          false)
  .option("--silent",              "Run headless with no CLI inpout oroutput.",     false)
  .option("--unlock <alias>",      "Unlocks resource for delete or modification.",  false)
  .option("--unlock-all",          "Unlocks resources for delete or modification.", false)
  .option("--validate",            "Only validate infrastructure definitions.",     false)

  .action(async (opts) => {
    

    displayStartBanner(opts.silent);
    if(!opts.silent) {
      console.log(`Stratoform starting...`);
      
      // TODO: Check to see if the file exists...
      console.log(`Configuration path is '${opts.configPath}'`);
      console.log(`Configuration '${opts.configPath}' loading...`);
      const _RuntimeConfig: IRuntimeConfig = loadConfig(opts);
      console.log(`Configuration '${opts.configPath}' loaded.`);
      console.log(`Using log path '${opts.logPath}'`);
      console.log(`Using log level '${opts.logLevel}'`);
      // TODO: Load the Logging in winston...
      
      console.log("Stratoform started! May the force live long and prosper.");
    }

  });



program.parseAsync()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
