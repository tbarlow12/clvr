import { readdirSync } from "fs";
import { sep } from "path";
import { InterpolateParameters } from "./models";
import { spawn } from "child_process";
import { normalize } from "path"

export class Utils {

  private static variableRegex = /\${([a-zA-Z]+)}/g
  
  public static getDirectories(source = ".") {
    return readdirSync(source, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
  }
  
  public static getDirName(directory: string) {
    directory = normalize(directory);
    const lastSlashIndex = directory.lastIndexOf(sep);
    return (lastSlashIndex < directory.length - 1) 
      ? directory.substring(lastSlashIndex + 1)
      : directory;
  }

  public static containsVariable(original: string): boolean {
    return !!original.match(Utils.variableRegex);
  }

  public static interpolateString(original: string, parameters: InterpolateParameters): string {
    const variables = original.match(Utils.variableRegex);
    if (variables) {
      for (const m of variables) {
        const key = m.replace("$", "").replace("{", "").replace("}", "");
        original = original.replace(m, parameters[key]);
      }
    }
    return original;
  }

  public static createSpawn(
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
}
