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
const testsGlob = config.testPattern;
const testFilter = program.tests;
Logger.log(`Looking for tests matching pattern '${testsGlob}'`);
if (testFilter) {
  Logger.log(`Filtering on tests that include ${testFilter}`);
}
let testFiles = glob.sync(testsGlob);
if (testFilter) {
  const lowerFilter = testFilter.toLowerCase();
  testFiles = testFiles.filter((file) => file.toLowerCase().includes(lowerFilter));
}
Logger.log(`Running tests: ${testFiles.join(", ")}`)
runTestFiles(testFiles);
