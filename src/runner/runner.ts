import { Logger } from "../utils/logger";
import { InterpolateParameters } from "../models/parameters";
import { DirectoryResultSet } from "../models/results";
import { CommandValidation } from "../models/validation";
import { Utils } from "../utils/utils";
import { Validator } from "../validate/validator";


export async function runCommandChain(
  directory: string,
  validations: CommandValidation[],
  results: DirectoryResultSet,
  parameters: InterpolateParameters,
  onFinish: (results: DirectoryResultSet) => void): Promise<any> {
  
  return new Promise(() => {
    if (validations.length === 0) {
      // Reached the end of the chain
      onFinish(results);
      return;
    }
    const validation = validations[0];

    // If condition predicate is defined and returns false, the command is skipped
    if (validation.condition && !validation.condition(directory)) {
      return runCommandChain(directory, validations.slice(1, validations.length), results, parameters, onFinish);
    }
    const command = Utils.interpolateString(validation.command, parameters);
    const split = command.split(" ");
    const commandName = split[0];
    const args = split.slice(1, split.length);
    const dirName = Utils.getDirName(directory);
    Logger.log("");
    Utils.createSpawn(
      directory,
      commandName,
      args,
      (stdout, stderr) => {
        Validator.validate(validation, directory, stdout, stderr, parameters, results);
        // Recursive call for the rest of the chain
        runCommandChain(directory, validations.slice(1, validations.length), results, parameters, onFinish);
        const result = results[validation.command];
        const state = (!result.run) ? "SKIPPED" : (result.passed) ? "PASSED" : "FAILED"; 
        Logger.log(`${state} - ${dirName} '${command}'`);
      },
      (stdout, stderr) => {
        const failureMessage = errorMessage(stdout, stderr, command, directory, results)
        results[validation.command] = {
          command,
          directory,
          run: true,
          passed: false,
          failureMessage,
          stdout,
          stderr,
        }
        if (validation.retries) {
          Logger.warn(`Command '${validation.command}' failed. Retrying ${validation.retries} more times`);
          validation.retries--;
          runCommandChain(directory, validations, results, parameters, onFinish);
        } else {
          onFinish(results);
        }
      }
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

