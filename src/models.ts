/**
 * Results of tests, organized first by directory name
 * and then by test command
 */
export interface ResultSet {
  /** Dictionary of dictionaries of test results */
  [dir: string]: DirectoryResultSet
}

/**
 * Dictionary of test results, organized by command
 */
export interface DirectoryResultSet {
  /** Dictionary of TestResults. Key is full string of command */
  [ command: string ]: TestResult
}

/**
 * Result of an individual test
 */
export interface TestResult {
  /** Indicates if test passed or not */
  passed: boolean;
  /** Indicates if the test was run or not */
  run: boolean;
  /** Failure message if applicable */
  failureMessage?: string;
  /** Full stdout of test */
  stdout?: string;
  /** Full stderr of test */
  stderr?: string;
}

/**
 * Arrays of summary strings for the tests that were run,
 * organized by state (passed, failed or skipped)
 */
export interface TestSummary {
  /** Summary of all tests that passed */
  passed: string[];
  /** Summary of all tests that failed */
  failed: string[];
  /** Summary of all tests that did not run */
  skipped: string[];
}

/**
 * Expected conditions for an output stream (stdout or stderr)
 */
export interface OutputValidation {
  /** The output should be *exactly* this string */
  shouldBeExactly?: string;
  /** The output should contain ALL of these strings */
  shouldContain?: string[];
  /** 
   * The output should contain ALL of these strings,
   * substituting any ${variables} for the values as passed
   * in by the parameters. 
   */
  shouldContainInterpolated?: string[];
}

/** Expected conditions for state of files in directory after command is run */
export interface FileValidation {
  /** Dictionary of descriptions of expected conditions, keyed by filename */
  [ fileName: string ]: {
    /** Indicates whether a file should exist within the test directory */
    shouldExist?: boolean;
    /** The file contents should contain ALL of these strings */
    shouldContain?: string[];
    /** The file content should be *exactly* this string */
    shouldBeExactly?: string;
  }
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
export interface DirectoryParameters {
  /** Dictionary of parameter dictionaries. Key is directory name */
  [dir: string]: InterpolateParameters
}

/**
 * Command to validate. Used as main configuration when defining
 * commands that need to be run and what their expected behavior is.
 */
export interface CommandValidation {
  /** Full string (including arguments) of command to run */
  command: string;
  /** Object that describes expected output to stdout */
  stdout?: OutputValidation;
  /** Object that describes expected output to stderr */
  stderr?: OutputValidation;
  /** Object that describes expected state of files in directory after test is run */
  files?: FileValidation;
}