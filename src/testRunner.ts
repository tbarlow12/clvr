import { DirectoryParameters } from "./parameters";
import { ResultSet } from "./results";
import { CommandValidation, runCommandChain } from "./commandRunner";
import { getDirectories, getDirName } from "./utils";

export function runTest(
      validations: CommandValidation[],
      directories: string[],
      parameters: DirectoryParameters = {}): Promise<ResultSet> {
    let testsCompleted = 0;
    
    const results: ResultSet = {};

    return new Promise<ResultSet>((resolve, reject) => {
      directories.forEach(directory => {
        const dirName = getDirName(directory);
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

export function logResults(test: (directories: string[]) => Promise<ResultSet>, directories: string[]) {
  test(directories)
    .then((results) => console.log(JSON.stringify(results, null, 2)))
    .catch((reason) => console.log(reason));
}