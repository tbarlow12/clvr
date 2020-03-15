import { readdirSync } from "fs";
import { InterpolateParameters } from "./parameters";
import { sep } from "path"

export function getCommandName(command: string) {
  const executables = new Set(["sls", "npm"])
  if (executables.has(command) && process.platform === "win32") {
    return command + ".cmd";
  }
  return command;
}

export function getDirectories(source = ".") {
  return readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
}

export function getDirName(directory: string) {
  const lastSlashIndex = directory.lastIndexOf(sep);
  return (lastSlashIndex < directory.length - 1) 
    ? directory.substring(lastSlashIndex + 1)
    : directory;
}

export function interpolateStrings(original: string[], parameters: InterpolateParameters): string[] {
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