import { ResultSet, TestSummary } from "./models";
import { Logger } from "./logger";

export class Summarizers {
  public static brief(results: ResultSet) {
    // Summarizers.printSummary(Summarizers.getBriefSummary(results));
  }

  public static verbose(results: ResultSet) {

  }

  public static markdownTable(results: ResultSet) {

  }

  private static printSummary(summary: TestSummary) {
    const {
      passed,
      failed,
      skipped
    } = summary;
    Logger.green(passed.join("\n"));
    Logger.warn(skipped.join("\n"));
    Logger.error(failed.join("\n"));
    if (failed.length > 0) {
      process.exit(1);
    }
  }
  
  /**
   * Get brief summary of tests that passed, failed or were skipped
   * @param results Test results
   */
  private static getBriefSummary(results: ResultSet): TestSummary {
    return {
      passed: Summarizers.getResultSummary(results, true, true),
      failed: Summarizers.getResultSummary(results, true, false),
      skipped: Summarizers.getResultSummary(results, false, false),
    };
  }

  private static getResultSummary(results: ResultSet, run: boolean, passed: boolean): string[] {
    const filtered = [];
    for (const directoryName of Object.keys(results)) {
      for (const testName of Object.keys(results[directoryName])) {
        const testResult = results[directoryName][testName];
        if (testResult.passed === passed && testResult.run === run) {
          const result = (passed) ? "PASSED" : "FAILED";
          let summary = `${result} - ${directoryName} - ${testName}`;
          if (testResult.failureMessage) {
            summary += ` - ${testResult.failureMessage}`
          }
          filtered.push(summary);
        }
      }
    }
    return filtered;
  }
}