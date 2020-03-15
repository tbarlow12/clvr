export interface ResultSet {
  [dir: string]: DirectoryResultSet
}

export interface DirectoryResultSet {
  [ testName: string ]: {
    passed: boolean;
    message?: string;
  }
}