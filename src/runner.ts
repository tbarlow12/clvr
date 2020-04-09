import { Utils } from "./utils";
import { DirectoryResultSet, CommandValidation, InterpolateParameters } from "./models";
import { Validator } from "./validator";
import { onExecutionError } from "./onError";
import { Logger } from "./logger";

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
  validation.command = Utils.interpolateString(validation.command, parameters);
  const command = validation.command;
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
      runCommandChain(directory, validations.slice(1, validations.length), results, onFinish, parameters);
      Logger.log(`${dirName} '${command}' finished`);
    },
    (stdout, stderr) => onExecutionError(stdout, stderr, command, directory, results)
  );
}