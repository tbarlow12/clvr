import { Utils } from "./utils";
import { DirectoryResultSet, CommandValidation, InterpolateParameters } from "./models";
import { Validator } from "./validator";
import { Logger } from "./logger";

export async function runCommandChain(
  directory: string,
  validations: CommandValidation[],
  results: DirectoryResultSet,
  parameters: InterpolateParameters,
  onFinish: (results: DirectoryResultSet) => void): Promise<any> {
  
  return new Promise((resolve, reject) => {
    if (validations.length === 0) {
      onFinish(results);
      return;
    }
    const validation = validations[0];

    // If condition predicate is defined and returns false, the step is skipped
    if (validation.condition && !validation.condition(directory)) {
      return runCommandChain(directory, validations.slice(1, validations.length), results, parameters, onFinish);
    }
    const command = Utils.interpolateString(validation.command, parameters);
    const split = command.split(" ");
    const commandName = split[0];
    const args = split.slice(1, split.length);
    const dirName = Utils.getDirName(directory);

    Utils.createSpawn(
      directory,
      commandName,
      args,
      (stdout, stderr) => {
        Validator.validate(validation, directory, stdout, stderr, parameters, results);
        // Recursive call for the rest of the chain
        runCommandChain(directory, validations.slice(1, validations.length), results, parameters, onFinish);
        Logger.log(`${dirName} '${command}' finished`);
      },
      (stdout, stderr) => reject(errorMessage(stdout, stderr, command, directory, results))
    );
  });
}

export function errorMessage(
  stdout: string,
  stderr: string,
  command: string,
  directory: string,
  results: DirectoryResultSet) {
  const message = `\nstdout: ${stdout}\nstderr: ${stderr}`
  results[command] = {
    directory,
    command,
    run: true,
    passed: false,
    failureMessage: message,
    stdout,
    stderr,
  }
  return `ERROR during '${command}' in '${directory}':\n\t${message}`;
}