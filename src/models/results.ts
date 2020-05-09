import { AssertionError } from "assert";

/**
 * Results of tests, organized first by directory name
 * and then by test command
 */
export interface ResultSet {
  /** Dictionary of dictionaries of test results */
  [dir: string]: DirectoryResultSet;
}

/**
 * Dictionary of test results, organized by command
 */
export interface DirectoryResultSet {
  /** Dictionary of TestResults. Key is full string of command */
  [ command: string ]: TestResult;
}

/**
 * Result of an individual test
 */
export interface TestResult {
  /** Directory for test result */
  directory: string;
  /** Command for test result */
  command: string;
  /** Indicates if test passed or not */
  passed: boolean;
  /** Indicates if the test was run or not */
  run: boolean;
  /** Failure message if applicable */
  failureMessage?: AssertionError|string;
  /** Full stdout of test */
  stdout?: string;
  /** Full stderr of test */
  stderr?: string;
  /** Don't print out stdout */
  silent?: boolean;
}

/**
 * Arrays of summary strings for the tests that were run,
 * organized by state (passed, failed or skipped)
 */
export interface TestSummary {
  /** Summary of all tests that passed */
  passed: TestResult[];
  /** Summary of all tests that failed */
  failed: TestResult[];
  /** Summary of all tests that did not run */
  skipped: TestResult[];
}

/**
 * The possible states of a test after being run
 */
export enum TestState {
  /** Test Passed */
  PASSED = "PASSED",
  /** Test Failed */
  FAILED = "FAILED",
  /** Test was Skipped */
  SKIPPED = "SKIPPED",
}