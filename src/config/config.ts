import fs from "fs";
import glob from "glob";
import path from "path";
import { Logger } from "../utils/logger";
import { Utils } from "../utils/utils";
import { Program } from "./program";

export interface CloverConfig {
  /** Parent of test directories */
  parentDir?: string;
  /** Regex filter for test directories - Regex should match entire folder name */
  directoryFilter?: string;
  /** Glob pattern for all test files Default is  '\*\*\/*.clvr.+(ts|js)' */
  testPattern: string;
  /** Filter for test files */
  testFilter?: string;
  /** Specifies if the tests should be run asynchronously. Default to false */
  runAsync: boolean;
}

const defaultConfig: CloverConfig = {
  testPattern: "**/*.clvr.@(ts|js|json)",
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
    const directoryRegex = this.getRegex(this.program.getDirFilter() || this.config.directoryFilter);
    if (!parentDirectory && !directoryRegex) {
      return ["."]
    }
    let directories = Utils.getDirectories(parentDirectory);
    if (directoryRegex) {
      directories = directories
        .filter((dir) => directoryRegex.test(Utils.getDirName(dir)));
    }
    return directories.map(Utils.normalizeSlash);
  }

  public getTests(): string[] {
    const testsGlob = this.config.testPattern;
    const testFilter = this.getRegex(this.program.getTestFilter() || this.config.testFilter);
    Logger.log(`Looking for tests matching pattern '${testsGlob}'`);
    if (testFilter) {
      Logger.log(`Filtering on tests containing '${testFilter}'`)
    }
    let testFiles = glob.sync(testsGlob);
    if (testFilter) {
      testFiles = testFiles
        .filter((file) => testFilter.test(Utils.getFileName(file)));
    }
    return testFiles.map(Utils.normalizeSlash);

  }

  private getRegex(value: string): RegExp|undefined {
    if (!value) {
      return undefined;
    }
    if (!value.startsWith("^")) {
      value = "^" + value;
    }
    if (!value.endsWith("$")) {
      value += "$";
    }
    return new RegExp(value, "i");
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
      if (this.program.getConfig()) {
        // User specified config file - warn them that it doesn't exist
        Logger.warn(`File ${configFileName} does not exist. Using default config`)
      }
      return defaultConfig;  
    }
  }
}
