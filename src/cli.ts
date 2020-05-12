#!/usr/bin/env node
import chalk from "chalk";
import glob from "glob";
import { getConfig } from "./config";
import { Logger } from "./logger";
import { program } from "./program";
import { runTestFiles } from "./testRunner";

Logger.asciiArt("clvr", chalk.greenBright);

const config = getConfig(program.config);
const testFiles = glob.sync(program.tests || config.tests);

runTestFiles(testFiles);
