import path from "path";
import fs from "fs";
import { Program } from "./program";
import { CommanderStatic } from "commander";
import { Logger } from "../utils/logger";
import glob from "glob";
import { Utils } from "../utils/utils";

export interface CloverConfig {
  /** Parent of test directories */
  parent?: string;
  /** Filter for test directories */
  directories?: string;
  /** Glob pattern for all test files Default is  '\*\*\/*.clvr.(ts|js)' */
  testPattern: string;
  /** Filter for test files */
  tests?: string;
  /** Specifies if the tests should be run asynchronously. Default to false */
  runAsync: boolean;
}

const defaultConfig: CloverConfig = {
  testPattern: "**/*.clvr.(ts|js)",
  runAsync: false,
}

export class Config {
  private config: CloverConfig;
  private program: CommanderStatic;
  
  public constructor() {
    this.program = Program.get();
    this.config = this.getConfig();
  }

  public getDirectories(): string[] {
    const parentDirectory: string = this.program.parent || this.config.parent;
    const directoryFilter: string = this.program.directories || this.config.directories
    let directories = Utils.getDirectories(parentDirectory);
    if (directoryFilter) {
      const lowerFilter = directoryFilter.toLowerCase();
      directories = directories
        .filter((dir) => dir.toLowerCase().includes(lowerFilter))
    }
    return directories.map(Utils.normalizeSlash);
  }

  public getTests(): string[] {
    const testsGlob = this.config.testPattern;
    const testFilter = this.program.tests || this.config.tests;
    Logger.log(`Looking for tests matching pattern '${testsGlob}'`);
    if (testFilter) {
      Logger.log(`Filtering on tests that include '${testFilter}'`);
    }
    let testFiles = glob.sync(testsGlob);
    if (testFilter) {
      const lowerFilter = testFilter.toLowerCase();
      const sep = path.sep;
      testFiles = testFiles
        .filter((file) => file.toLowerCase().includes(lowerFilter))
    }
    return testFiles.map(Utils.normalizeSlash);

  }

  private getConfig(): CloverConfig {
    const fullConfigPath = (path.join(process.cwd(), this.program.config || "clvr.config.json"));
    if (fs.existsSync(fullConfigPath)) {
      const config: CloverConfig = require(fullConfigPath);
      return {
        ...defaultConfig,
        ...config
      };
    } else {
      return defaultConfig;  
    }
  }
}
