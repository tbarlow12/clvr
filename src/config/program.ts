import commander, { CommanderStatic } from "commander";
import { Logger } from "../utils/logger";
const packageJson = require("../../package.json");

export enum CliArg {
  CONFIG = "config",
  TEST_FILTER = "testFilter",
  DIR_FILTER = "dirFilter",
  PARENT = "parentDir",
}

export class Program {
  private program: CommanderStatic;

  public constructor() {
    this.program = commander
      .version(packageJson.version)
      .description("This is my CLI")
      .option(`-c, --${CliArg.CONFIG} <${CliArg.CONFIG}>`, "Path to configuration file")
      .option(`-p, --${CliArg.PARENT} <${CliArg.PARENT}>`, "Path to parent of test directories")
      .option(`-t, --${CliArg.TEST_FILTER} <${CliArg.TEST_FILTER}>`, "Filter for test file(s)")
      .option(`-d, --${CliArg.DIR_FILTER} <${CliArg.DIR_FILTER}>`, "Filter for test directories")
      .parse(process.argv);
  } 

  public getConfig() {
    return this.program[CliArg.CONFIG];
  }

  public getTestFilter() {
    return this.program[CliArg.TEST_FILTER];
  }

  public getDirFilter() {
    return this.program[CliArg.DIR_FILTER];
  }

  public getParent() {
    return this.program[CliArg.PARENT];
  }
}
