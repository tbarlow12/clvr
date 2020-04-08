import { ResultSet, TestSummary } from "./models";

/**
 * Helper class for summarizing test results
 */
export class CloverSummarizer {

  public static printBriefSummary(test: (directories: string[]) => Promise<ResultSet>, directories: string[]) {
    test(directories)
      .then((results) => {
        const {
          passed,
          failed,
          skipped
        } = this.getBriefSummary(results);
        passed.forEach((s) => console.log(s));
        skipped.forEach((s) => console.log(s));
        failed.forEach((s) => console.log(s));
      });
  }
  
  /**
   * Get brief summary of tests that passed, failed or were skipped
   * @param results Test results
   */
  private static getBriefSummary(results: ResultSet): TestSummary {
    return {
      passed: this.getResultSummary(results, true, true),
      failed: this.getResultSummary(results, true, false),
      skipped: this.getResultSummary(results, false, false),
    };
  }

  private static getResultSummary(results: ResultSet, run: boolean, passed: boolean) {
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