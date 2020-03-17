import { CommandValidation, runCommandChain } from "./commandRunner";
import { DirectoryParameters } from "./parameters";
import { ResultSet } from "./results";
import { getDirName } from "./utils";

export function runTest(
      validations: CommandValidation[],
      directories: string[],
      parameters: DirectoryParameters = {}): Promise<ResultSet> {
    let testsCompleted = 0;
    
    const results = InitializeResultSet(directories, validations);

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

export function InitializeResultSet(directories: string[], validations: CommandValidation[]): ResultSet {
  const results: ResultSet = {};
  for (const d of directories) {
    const dirName = getDirName(d);
    for (const v of validations) {
      if (!(dirName in results)) {
        results[dirName] = {}
      }
      results[dirName][v.command] = {
        passed: false,
        run: false
      }
    }
  }

  return results;
}

export function logResults(test: (directories: string[]) => Promise<ResultSet>, directories: string[]) {
  test(directories)
    .then((results) => {
      const passed = getResults(results, true, true);
      const failed = getResults(results, true, false);
      const skipped = getResults(results, false, false);
      if (passed.length > 0) {
        console.log(`Passed:\n${passed.join("\n")}`);
      }
      if (failed.length > 0) {
        console.log(`Failed:\n${failed.join("\n")}`);
      }
      if (skipped.length > 0) {
        console.log(`Failed:\n${skipped.join("\n")}`);
      }
    })
    .catch((reason) => console.log(reason));
}

export function getResults(results: ResultSet, run: boolean, passed: boolean) {
  const filtered = [];
  for (const directoryName of Object.keys(results)) {
    for (const testName of Object.keys(results[directoryName])) {
      const testResult = results[directoryName][testName];
      if (testResult.passed === passed && testResult.run === run) {
        const result = (passed) ? "PASSED" : "FAILED";
        let summary = `${result} - ${directoryName} - ${testName}`;
        if (testResult.message) {
          summary += ` - ${testResult.message}`
        }
        filtered.push(summary);
      }
    }
  }
  return filtered;
}