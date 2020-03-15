import { spawn } from "child_process";

export function createSpawn(
  cwd: string,
  command: string,
  args: string[],
  onPass: (stdout: string, stderr: string) => void,
  onFail: (stdout: string, stderr: string) => void) {

  const childProcess = spawn(command, args, {
    env: process.env,
    cwd,
  });

  let stdout = "";
  let stderr = "";

  childProcess.stderr.on("data", (data) => {
    stderr += data.toString();
  });

  childProcess.stdout.on("data", (data) => {
    stdout += data.toString();
  });

  childProcess.on("error", (err) => {
    stderr += `Failed to start subprocess:\n${err.message} ${err.stack}`;
    
  });

  childProcess.on("close", (code) => {
    if (code === 0) {
      onPass(stdout, stderr);
    } else {
      onFail(stdout, stderr);
    }
  });
  return childProcess
}