import { ResultSet, TestSummary, TestResult, TestState } from "./models";
import { Logger } from "./logger";
import path from "path";
import { AssertionError } from "assert";

export class Summarizers {
  public static brief(results: ResultSet) {
    Summarizers.printSummary(results, (result, state) => {
      const { directory, command, failureMessage } = result;
      const dirName = path.normalize(directory)
        .substring(directory.lastIndexOf(path.sep));
      let message = `${state} - ${dirName} - ${command}`;
      if (failureMessage) {
        message += `- ${failureMessage}`;
      }
      return message;
    });
  }

  public static verbose(results: ResultSet) {
    Summarizers.printSummary(results, (result, state) => {
      const { directory, command, failureMessage, stdout} = result;
      const dirName = path.normalize(directory)
        .substring(directory.lastIndexOf(path.sep));
      let message = `${state} - ${dirName} - ${command}`;
      if (failureMessage) {
        message += ` - ${failureMessage}`;
      }
      message += `\nstdout:\n${stdout}`
      return message;
    });
  }

  public static markdownTable(results: ResultSet) {

  }

  private static printSummary(results: ResultSet, stringify: (result: TestResult, state: TestState) => string) {
    const summary = this.getTestSummary(results)
    const {
      passed,
      failed,
      skipped
    } = summary;
    Logger.green(passed.map((result) => stringify(result, TestState.PASSED)).join("\n"));
    Logger.warn(skipped.map((result) => stringify(result, TestState.SKIPPED)).join("\n"));
    Logger.error(failed.map((result) => stringify(result, TestState.FAILED)).join("\n"));
    if (failed.length > 0) {
      throw new Error(`Failed ${failed.length} of ${passed.length + skipped.length + failed.length} tests`);
    }
  }
  
  /**
   * Get brief summary of tests that passed, failed or were skipped
   * @param results Test results
   */
  private static getTestSummary(results: ResultSet): TestSummary {
    return {
      passed: Summarizers.getResultSummary(results, true, true),
      failed: Summarizers.getResultSummary(results, true, false),
      skipped: Summarizers.getResultSummary(results, false, false),
    };
  }

  private static getResultSummary(results: ResultSet, run: boolean, passed: boolean): TestResult[] {
    const filtered = [];
    for (const directoryName of Object.keys(results)) {
      for (const testName of Object.keys(results[directoryName])) {
        const testResult = results[directoryName][testName];
        if (testResult.passed === passed && testResult.run === run) {
          filtered.push(testResult);
        }
      }
    }
    return filtered;
  }
}