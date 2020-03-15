import { DirectoryResultSet } from "./results";
import { createSpawn } from "./spawn";
import { getCommandName, getDirName } from "./utils";
import { OutputValidation, validateOutput } from "./validate";
import { InterpolateParameters } from "./parameters";
import { sep } from "path"

export interface CommandValidation {
  command: string;
  stdout?: OutputValidation;
  stderr?: OutputValidation;
}

export function runCommandChain(
    directory: string,
    validations: CommandValidation[],
    results: DirectoryResultSet,
    onFinish: (results: DirectoryResultSet) => void,
    parameters: InterpolateParameters) {
  if (validations.length === 0) {
    onFinish(results);
    return;
  }
  const validation = validations[0];
  const command = validation.command;
  const split = command.split(" ");
  // Example: sls (or sls.cmd if on windows)
  const commandName = getCommandName(split[0]);
  // Example: ["invoke", "-f", "hello", "-d", "'{\"name\":\"Azure\"}'"]
  const args = split.slice(1, split.length);

  const dirName = getDirName(directory);
  
  createSpawn(
    directory,
    commandName,
    args,
    (stdout, stderr) => {
      validateOutput(validation.stdout, stdout, parameters);
      validateOutput(validation.stderr, stderr, parameters);
      results[command] = {
        passed: true
      }
      // Recursive call for the rest of the chain
      runCommandChain(directory, validations.slice(1, validations.length), results, onFinish, parameters);
      console.log(`${dirName} '${command}' finished`);
    },
    (stdout, stderr) => {
      const message = `stdout:\n${stdout}\nstderr:\n${stderr}`
      results[command] = {
        passed: false,
        message,
      }
      throw new Error(`ERROR during '${command}' in '${dirName}':\n"  ${message}`);      
    }
  )
}
