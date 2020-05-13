import { readdirSync } from "fs";
import { sep } from "path";
import { spawn } from "cross-spawn";
import { normalize } from "path"
import { InterpolateParameters } from "./models/parameters";
import { Logger } from "./logger";

export class Utils {

  private static variableRegex = /\${([a-zA-Z]+)}/g
  
  public static getDirectories(source = ".") {
    return readdirSync(source, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
  }
  
  public static getDirName(directory: string) {
    directory = normalize(directory);
    if (directory.endsWith(sep)) {
      directory = directory.substring(0, directory.length - 1);
    }
    const lastSlashIndex = directory.lastIndexOf(sep);
    return directory.substring(lastSlashIndex + 1);
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

  public static async createSpawn(
    cwd: string,
    command: string,
    args: string[],
    onPass: (stdout: string, stderr: string) => void,
    onFail: (stdout: string, stderr: string) => void,
    inheritStdio = false) {
  
    const childProcess = spawn(command, args, {
      env: process.env,
      cwd,
      stdio: (inheritStdio) ? "inherit" : undefined
    });
  
    let stdout = "";
    let stderr = "";

    if (!inheritStdio && childProcess.stdout && childProcess.stderr) {
      childProcess.stderr.on("data", (data) => {
        stderr += data.toString();
      });
    
      childProcess.stdout.on("data", (data) => {
        stdout += data.toString();
      });
    
      childProcess.on("error", (err) => {
        stderr += `Failed to start subprocess:\n${err.message} ${err.stack}`;
      });
    }
  
    childProcess.on("close", (code) => {
      if (code === 0) {
        onPass(stdout, stderr);
      } else {
        onFail(stdout, stderr);
      }
    });
    return childProcess
  }

  // public static spawnInherit(command: string, args: string[]): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     const childProcess = spawn(command, args, {
  //       stdio: "inherit"
  //     });

  //     childProcess.on("close", (code) => {
  //       if (code === 0) {

  //       }
  //     });
  
  //     childProcess.on("exit", (code, signal) => {
  //       if (code === 0) {
  //         resolve();
  //       } else {
  //         // const message = `Exited command '${command}' with error code ${code}`
  //         // Logger.error(message);
  //         // reject(message);
  //         reject();
  //       }
  //     });
  //   });
  // }
}
