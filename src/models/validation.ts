import { InterpolateParameters } from "./parameters";

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
   * The output should contain ALL of these regex matches
   * Allows for interpolation of ${variables}
   */
  shouldContainMatch?: RegExp[]|string[]
  /**
   * The output should contain NONE of these strings.
   * Allows for interpolation of ${variables}
   */
  shouldNotContain?: string[];
  /**
   * The output should contain NONE of regex matches.
   * Allows for interpolation of ${variables}
   */
  shouldNotContainMatch?: RegExp[]|string[]
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
 * Command to validate. Used as main configuration when defining
 * commands that need to be run and what their expected behavior is.
 */
export interface CommandValidation {
  /** 
   * Full string (including arguments) of command to run 
   */
  command: string;
  /**
   * Object that describes expected output to stdout
   */
  stdout?: ContentValidation;
  /**
   * Object that describes expected output to stderr
   */
  stderr?: ContentValidation;
  /**
   * Object that describes expected state of files in directory after test is run
   */
  files?: FileStructureValidation;
  /**
   * Custom predicate for command result
   */
  custom?: {(parameters: InterpolateParameters, directory: string, stdout: string, stderr: string): void};
  /**
   * Predicate condition that, if false, prevents the step from being run
   */
  condition?: {(directory: string): boolean};
  /**
   * Does not print stdout from command (will still print stderr)
   */
  silent?: boolean
  /**
   * Number of times to try executing the command if fails (does not retry on assertion failures)
   */
  retries?: number
}