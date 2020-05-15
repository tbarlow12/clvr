import path from "path";
import { Logger } from "../utils/logger";
import { ResultSet, TestResult, TestState, TestSummary } from "../models/results";
import { Utils } from "../utils/utils";

export class Summarizers {
  public static brief(results: ResultSet, name?: string) {
    Summarizers.printSummary(results, (result, state) => {
      const { directory, command, failureMessage } = result;
      const dirName = path.normalize(directory)
        .substring(directory.lastIndexOf(path.sep) + 1);
      let message = `${state} - ${dirName} - ${command}`;
      if (failureMessage) {
        message += `- ${failureMessage}`;
      }
      return message;
    }, name);
  }

  public static verbose(results: ResultSet, name?: string) {
    Summarizers.printSummary(results, (result, state) => {
      const { directory, command, failureMessage, stdout, silent } = result;
      const dirName = Utils.getDirName(directory);
      let message = `${state} - ${dirName} - ${command}`;
      if (failureMessage) {
        message += ` - ${failureMessage}`;
      }
      if (!silent) {
        message += `\nstdout:\n${stdout}`;
      }
      return message;
    }, name);
  }

  private static printSummary(
      results: ResultSet,
      stringify: (result: TestResult, state: TestState) => string,
      name?: string) {
    const summary = this.getTestSummary(results)
    const {
      passed,
      failed,
      skipped
    } = summary;
    Logger.green(passed.map((result) => stringify(result, TestState.PASSED)).join("\n"));
    Logger.warn(skipped.map((result) => stringify(result, TestState.SKIPPED)).join("\n"));
    Logger.error(failed.map((result) => stringify(result, TestState.FAILED)).join("\n"));
    const p = passed.length;
    const f = failed.length;
    const s = skipped.length;
    const total = p + f + s;
    const finalMessage = [
      `TEST RESULTS: ${name || ""}`,
      `TOTAL: ${total}`,
      `PASSED: ${p}`,
      `SKIPPED: ${s}${(s > 0) ? "\n" + skipped.map(this.resultLine).join("\n") : ""}`,
      `FAILED: ${f}${(f > 0) ? "\n" + failed.map(this.resultLine).join("\n") : ""}`,
    ].join("\n");
    Logger.log(finalMessage);
    if (failed.length > 0) {
      throw new Error(`Failed ${f} of ${total} tests`);
    }
  }

  private static resultLine(result: TestResult): string {
    return `\t${result.directory} - ${result.command}`
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