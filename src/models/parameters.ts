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
