import { DirectoryResultSet } from "./models";

export function onExecutionError(stdout: string, stderr: string, command: string, directory: string, results: DirectoryResultSet) {
  const message = `stdout: ${stdout}stderr: ${stderr}`
    results[command] = {
      run: true,
      passed: false,
      failureMessage: message,
      stdout,
      stderr,
    }
    throw new Error(`ERROR during '${command}' in '${directory}':\n\t${message}`);
}