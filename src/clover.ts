import { Initializer } from "./initializer";
import { CommandValidation, DirectoryParameters, ResultSet } from "./models";
import { runCommandChain } from "./runner";
import { Utils } from "./utils";
import { Summarizer } from "./summarizer";

/**
 * Client class for Clover library
 */
export class Clover {

  /**
   * Run a command-line validation
   * @param validations Commands to validate
   * @param directories Directories in which to run commands
   * @param parameters Substitute values for variables in expected conditions
   */
  public static run(
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

  public static runSuite(tests: {(directories: string[]): Promise<ResultSet>}[], directories: string[]) {
    tests.forEach((test) => {
      this.summarize(test, directories);
    })
  }

  public static summarize(test: (directories: string[]) => Promise<ResultSet>, directories: string[]) {
    Summarizer.printBriefSummary(test, directories);
  }
}
