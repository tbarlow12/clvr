import path from "path";
import { run } from "./clover";
import { constants } from "./constants";
import { CloverTest } from "./models/clover";
import { Utils } from "./utils";

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
  Utils.createSpawn(
    process.cwd(),
    executor,
    [ testFile ],
    () => { runTestFiles(testFiles.slice(1, testFiles.length)); },
    () => { process.exit(1); },
    true); 
}