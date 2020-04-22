import { Initializer } from "./initializer";
import { CommandValidation, Parameters, ResultSet, CloverTest } from "./models";
import { runCommandChain } from "./runner";
import { Utils } from "./utils";
import { Summarizers } from "./summarizers";

/**
 * Run clover tests
 * @param tests Array of clover tests to run
 * @param summarizer 
 */
export async function run(tests: CloverTest[], summarizer: (results: ResultSet) => void = Summarizers.verbose): Promise<CloverTest[]> {
  for (const test of tests) {
    const { validations, directories, parameters } = test;
    try {
      const results = await execute(validations, directories || ["."], parameters);
      summarizer(results);
      test.results = results;
    } catch (err) {
      throw new Error(err);
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
      runCommandChain(directory, validations, {}, parameters[dirName],
        (testResults) => {
          results[dirName] = testResults;
          testsCompleted += 1;
          if (testsCompleted === directories.length) {
            // TODO finish timer here
            resolve(results);
          }
        })
        .catch((reason) => {
          // TODO finish timer here
          reject(reason)
        });
    });
  });    
}
