export interface ResultSet {
  [dir: string]: DirectoryResultSet
}

export interface DirectoryResultSet {
  [ testName: string ]: TestResult
}

export interface TestResult {
  passed: boolean;
  run: boolean;
  message?: string;
}