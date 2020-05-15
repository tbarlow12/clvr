#!/usr/bin/env node
import chalk from "chalk";
import { runTestFiles } from "./runner/testRunner";
import { Logger } from "./utils/logger";
import { Config } from "./config/config";

Logger.asciiArt("clvr", chalk.greenBright);
const config = new Config();

const testFiles = config.getTests();
const directories = config.getDirectories();
Logger.log("Tests: " + testFiles.join(","));
Logger.log("Directories: " + directories.join(","));
runTestFiles(testFiles);
