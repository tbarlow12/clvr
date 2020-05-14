import commander, { CommanderStatic } from "commander";
import { Logger } from "../utils/logger";
const packageJson = require("../../package.json");

enum CliArg {
  CONFIG = "config",
  TESTS = "tests",
  DIRECTORIES = "dirs",
  PARENT = "parentDir",
}

export class Program {
  private program: CommanderStatic;

  public constructor() {
    Logger.log(process.argv.join(","))
    this.program = commander
      .version(packageJson.version)
      .description("This is my CLI")
      .option(`-c, --${CliArg.CONFIG} <${CliArg.CONFIG}>`, "Path to configuration file")
      .option(`-p, --${CliArg.PARENT} <${CliArg.PARENT}>`, "Path to parent of test directories")
      .option(`-t, --${CliArg.TESTS} <${CliArg.TESTS}>`, "Filter for test file(s)")
      .option(`-d, --${CliArg.DIRECTORIES} <${CliArg.DIRECTORIES}>`, "Filter for test directories")
      .parse(process.argv);
  } 

  public getConfig() {
    return this.program[CliArg.CONFIG];
  }

  public getTests() {
    return this.program[CliArg.TESTS];
  }

  public getDirectories() {
    return this.program[CliArg.DIRECTORIES];
  }

  public getParent() {
    return this.program[CliArg.PARENT];
  }
}
