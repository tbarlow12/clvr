import fs from "fs";
import glob from "glob";
import path from "path";
import { Logger } from "../utils/logger";
import { Utils } from "../utils/utils";
import { Program } from "./program";

export interface CloverConfig {
  /** Parent of test directories */
  parentDir?: string;
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
  private program: Program;
  
  public constructor() {
    this.program = new Program();
    this.config = this.getConfig();
  }

  public getDirectories(): string[] {
    const parentDirectory: string = this.program.getParent() || this.config.parentDir;
    Logger.log(`Using parent directory ${parentDirectory}`);
    const directoryFilter: string = this.program.getDirectories() || this.config.directories;
    let directories = Utils.getDirectories(parentDirectory);
    if (directoryFilter) {
      Logger.log(`Filtering on directories that include '${directoryFilter}'`)
      const lowerFilter = directoryFilter.toLowerCase();
      directories = directories
        .filter((dir) => dir.toLowerCase().includes(lowerFilter))
    }
    return directories.map(Utils.normalizeSlash);
  }

  public getTests(): string[] {
    const testsGlob = this.config.testPattern;
    const testFilter = this.program.getTests() || this.config.tests;
    Logger.log(`Looking for tests matching pattern '${testsGlob}'`);
    if (testFilter) {
      Logger.log(`Filtering on tests that include '${testFilter}'`);
    }
    let testFiles = glob.sync(testsGlob);
    if (testFilter) {
      const lowerFilter = testFilter.toLowerCase();
      testFiles = testFiles
        .filter((file) => file.toLowerCase().includes(lowerFilter))
    }
    return testFiles.map(Utils.normalizeSlash);

  }

  private getConfig(): CloverConfig {
    const configFileName = this.program.getConfig() || "clvr.config.json";
    const fullConfigPath = (path.join(process.cwd(), configFileName));
    if (fs.existsSync(fullConfigPath)) {
      const config: CloverConfig = require(fullConfigPath);
      return {
        ...defaultConfig,
        ...config
      };
    } else {
      Logger.warn(`File ${configFileName} does not exist. Using default config`)
      return defaultConfig;  
    }
  }
}
