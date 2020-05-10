import { Initializer } from "./initializer";
import { Logger } from "./logger";
import { CloverTest } from "./models/clover";
import { Parameters } from "./models/parameters";
import { ResultSet } from "./models/results";
import { CommandValidation } from "./models/validation";
import { runCommandChain } from "./runner";
import { Summarizers } from "./summarizers";
import { Utils } from "./utils";

/**
 * Run clover tests
 * @param tests Array of clover tests to run
 */
export function run(tests: CloverTest[]) {
  runInternal(tests).catch(() => { process.exit(1); });
}

/**
 * Run clover tests
 * @param tests Array of clover tests to run
 * @param summarizer 
 */
export async function runInternal(tests: CloverTest[], summarizer: (results: ResultSet, name?: string) => void = Summarizers.verbose): Promise<CloverTest[]> {
  for (const test of tests) {
    const { validations, parameters } = test;
    const directories = test.directories || ["."]

    // Initialize result set with all commands for each directory
    test.results = Initializer.resultSet(directories as string[], validations);
    try {
      const results = await execute(validations, directories, parameters);
      test.results = results;
      summarizer(results, test.name);
    } catch (err) {
      Logger.error(err);
      return Promise.reject(err);
    }    
  }
  return tests;
}

/**
 * Run a command-line validation
 * @param validations Commands to validate
 * @param directories Directories in which to run commands
 * @param parameters Substitute values for variables in expected conditions
 */
function execute(
  validations: CommandValidation[],
  directories: string[],
  parameters: Parameters = {}): Promise<ResultSet> {
  return new Promise((resolve, reject) => {
    let testsCompleted = 0;
    const results = Initializer.resultSet(directories, validations);
    if (directories.length === 0) {
      reject("Cannot run validations on empty directory set");
    }
    directories.forEach(directory => {
      const dirName = Utils.getDirName(directory);
      // TODO start timer here
      runCommandChain(directory, validations, results[dirName], parameters[dirName],
        (testResults) => {
          results[dirName] = testResults;
          testsCompleted += 1;
          if (testsCompleted === directories.length) {
            // TODO finish timer here
            resolve(results);
          }
        });
    });
  });    
}
