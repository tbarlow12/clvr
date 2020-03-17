import { readdirSync } from "fs";
import { sep } from "path";
import { InterpolateParameters } from "./models";
import { spawn } from "child_process";

export class Utils {
  
  public static getDirectories(source = ".") {
    return readdirSync(source, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
  }
  
  public static getDirName(directory: string) {
    const lastSlashIndex = directory.lastIndexOf(sep);
    return (lastSlashIndex < directory.length - 1) 
      ? directory.substring(lastSlashIndex + 1)
      : directory;
  }
  
  public static interpolateStrings(original: string[], parameters: InterpolateParameters): string[] {
    const variableRegex = /\${([a-zA-Z]+)}/g
    return original.map((s) => {
      const variables = s.match(variableRegex);
      if (variables) {
        for (const m of variables) {
          const key = m.replace("$", "").replace("{", "").replace("}", "");
          s = s.replace(m, parameters[key]);
        }
      }
      return s;
    });
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
