import { ResultSet, TestSummary, TestResult, TestState } from "./models";
import { Logger } from "./logger";

export class Summarizers {
  public static brief(results: ResultSet) {
    Summarizers.printSummary(results, (result, state) => {
      return JSON.stringify(result, null, 2);
    });
  }

  public static verbose(results: ResultSet) {

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
      process.exit(1);
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