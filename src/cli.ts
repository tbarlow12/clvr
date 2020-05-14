#!/usr/bin/env node
import chalk from "chalk";
import { runTestFiles } from "./runner/testRunner";
import { Logger } from "./utils/logger";
import { Config } from "./config/config";

Logger.asciiArt("clvr", chalk.greenBright);
const config = new Config();
const testFiles = config.getTests();
Logger.log(`Running tests: ${testFiles.join(",")}`);
runTestFiles(testFiles);
