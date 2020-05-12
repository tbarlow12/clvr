#!/usr/bin/env node
import chalk from "chalk";
import glob from "glob";
import { getConfig } from "./config";
import { Logger } from "./logger";
import { Program } from "./program";
import { runTestFiles } from "./testRunner";

Logger.asciiArt("clvr", chalk.greenBright);
const program = Program.get();
const config = getConfig(program.config);
const testsGlob = program.tests || config.tests;
Logger.log(`Looking for tests matching pattern '${testsGlob}'`);
const testFiles = glob.sync(testsGlob);
Logger.log(`Running tests: ${testFiles.join(", ")}`)
runTestFiles(testFiles);
