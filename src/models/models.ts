import { AssertionError } from "assert";

export interface CloverTest {
  /**
   * The only required property. Array of commands to 
   * execute along with their accompanying assertions.
   */
  validations: CommandValidation[];
  /**
   * Name of test to be used in output
   */
  name?: string;
  /**
   * Directories in which to execute the commands.
   * Relative to the current working directory.
   */
  directories?: string[];
  /**
   * String parameters for string interpolation in commands, 
   * paths or assertions. Broken down by directory.
   */
  parameters?: Parameters;
  /**
   * Should not be added by user. Because this is an
   * asynchronous process, each test result is attached to
   * the test object from which it came. The results are
   * printed out at the end of all test executions.
   */
  results?: ResultSet;
}

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

export enum TestState {
  PASSED = "PASSED",
  FAILED = "FAILED",
  SKIPPED = "SKIPPED",
}

/**
 * Expected conditions for an output stream (stdout or stderr)
 */
export interface ContentValidation {
  /** 
   * The output should be *exactly* this string.
   * Allows for interpolation of ${variables}
   */
  shouldBeExactly?: string;
  /** 
   * The output should contain ALL of these strings.
   * Allows for interpolation of ${variables}
   */
  shouldContain?: string[];
  /**
   * The output should contain NONE of these strings.
   * Allows for interpolation of ${variables}
   */
  shouldNotContain?: string[];
  /**
   * Specifies whether or not the output should be empty
   */
  isEmpty?: boolean;
}

export interface FileValidation extends ContentValidation {
  /**
   * Specifies whether or not the file should exist
   */
  shouldExist?: boolean;
}

/** Expected conditions for state of files in directory after command is run */
export interface FileStructureValidation {
  /** Dictionary of descriptions of expected conditions, keyed by filename */
  [ fileName: string ]: FileValidation;
}

/**
 * Values to substitute in for a ${variable} for a set of tests
 */
export interface InterpolateParameters {
  /** Values to substitute for a set of tests */
  [variableName: string]: string;
}

/**
 * Dictionary of parameter sets, keyed by the NAME of the
 * directory using the parameter set
 */
export interface Parameters {
  /** Dictionary of parameter dictionaries. Key is directory name */
  [dir: string]: InterpolateParameters;
}

/**
 * Command to validate. Used as main configuration when defining
 * commands that need to be run and what their expected behavior is.
 */
export interface CommandValidation {
  /** Full string (including arguments) of command to run */
  command: string;
  /** Object that describes expected output to stdout */
  stdout?: ContentValidation;
  /** Object that describes expected output to stderr */
  stderr?: ContentValidation;
  /** Object that describes expected state of files in directory after test is run */
  files?: FileStructureValidation;
  /** Custom predicate for command result */
  custom?: {(parameters: InterpolateParameters, directory: string, stdout: string, stderr: string): void};
  /** Predicate condition that, if false, prevents the step from being run */
  condition?: {(directory: string): boolean};
  /** Does not print stdout from command (will still print stderr) */
  silent?: boolean
}
