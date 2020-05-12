import { Parameters } from "./parameters"
import { ResultSet } from "./results"
import { CommandValidation } from "./validation"

/**
 * Primary structure for tests using Clover
 * Only required attribute is `validations`, which is
 * an array of Command Validations.
 */
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







