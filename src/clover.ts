import { Initializer } from "./initializer";
import { CommandValidation, DirectoryParameters, ResultSet, CloverTest } from "./models";
import { runCommandChain } from "./runner";
import { Utils } from "./utils";
import { Summarizers } from "./summarizers";

/**
 * Client class for Clover library
 */
export class Clover {

  public static async run(tests: CloverTest[], summarizer: (results: ResultSet) => void = Summarizers.brief): Promise<CloverTest[]> {
    for (const test of tests) {
      const { validations, directories, parameters } = test;
      var results = await this.execute(validations, directories || ["."], parameters);
      summarizer(results);
      test.results = results;
    }
    return tests;
  }

    /**
   * Run a command-line validation
   * @param validations Commands to validate
   * @param directories Directories in which to run commands
   * @param parameters Substitute values for variables in expected conditions
   */
  private static execute(
      validations: CommandValidation[],
      directories: string[],
      parameters: DirectoryParameters = {}): Promise<ResultSet> {
    let testsCompleted = 0;
    
    const results = Initializer.resultSet(directories, validations);

    return new Promise<ResultSet>((resolve, reject) => {
      directories.forEach(directory => {
        const dirName = Utils.getDirName(directory);
        try {
          runCommandChain(directory, validations, {}, (testResults) => {
            results[dirName] = testResults;
            testsCompleted += 1;
            if (testsCompleted === directories.length) {
              resolve(results);
            }
          }, parameters[dirName]);
        } catch(err) {
          reject(err);
        }        
      });
    });
  }
}
