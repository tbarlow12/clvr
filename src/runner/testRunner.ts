import path from "path";
import { run } from "./clover";
import { constants } from "../utils/constants";
import { CloverTest } from "../models/clover";
import { Utils } from "../utils/utils";
import { Logger } from "../utils/logger";

export async function runTestFiles(testFiles: string[]) {
  if (testFiles.length === 0) {
    return Promise.resolve();
  }
  const testFile = testFiles[0];
  let executor: string|undefined = undefined;
  if (testFile.endsWith(".ts")) {
    executor = constants.tsNode;
  } else if (testFile.endsWith(".js")) {
    executor = constants.node;
  } else if (testFile.endsWith(".json")) {
    const test: CloverTest = require(path.join(process.cwd(), testFile));
    run(test);
    return Promise.resolve();
  } else {
    throw new Error(`Invalid file: ${testFile}`);
  }
  const args: string[] = []
  for (let i = 2; i < process.argv.length; i++) {
    args.push(process.argv[i]);
  }  
  Utils.createSpawn(
    process.cwd(),
    executor,
    [ testFile, ...args ],
    () => { runTestFiles(testFiles.slice(1, testFiles.length)); },
    () => { 
      Logger.error(`Test ${testFile} execution failed`);
      process.exit(1);
    },
    true); 
}