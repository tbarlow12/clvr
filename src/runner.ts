import { 
  CommandValidation,
  DirectoryParameters,
  DirectoryResultSet,
  InterpolateParameters,
  ResultSet,
  OutputValidation,
  FileValidation
} from "./models";
import { Utils } from "./utils";
import { join, sep } from "path"
import fs from "fs";

/**
 * Client class for Clover library
 */
export class Clover {

  /**
   * Run a command-line validation
   * @param validations Commands to validate
   * @param directories Directories in which to run commands
   * @param parameters Substitute values for variables in expected conditions
   */
  public static run(
      validations: CommandValidation[],
      directories: string[],
      parameters: DirectoryParameters = {}): Promise<ResultSet> {
    let testsCompleted = 0;
    
    const results = this.initializeResultSet(directories, validations);

    return new Promise<ResultSet>((resolve, reject) => {
      directories.forEach(directory => {
        const dirName = Utils.getDirName(directory);
        try {
          this.runCommandChain(directory, validations, {}, (testResults) => {
            results[dirName] = testResults;
            testsCompleted += 1;
            if (testsCompleted === directories.length) {
              resolve(results);
            }
          }, parameters[dirName]);
        } catch(err) {
          reject(err);
        }        
      });
    });
  }

  private static validateOutput(
      outputValidation: OutputValidation|undefined,
      output: string,
      parameters: InterpolateParameters) {
    if (!outputValidation) {
      return;
    }
    const { shouldBeExactly, shouldContain } = outputValidation;
    if (shouldBeExactly && shouldContain) {
      throw new Error("Can't specify both `shouldBeExactly` and `shouldContain`");
    }
    if (shouldBeExactly) {
      const interpolated = Utils.interpolateString(shouldBeExactly, parameters);
      if (output !== interpolated) {
        return `Expected: ${interpolated}\nReceived: ${output}`;
      }
    }
    if (shouldContain) {
      for (const item of shouldContain) {
        const interpolated = Utils.interpolateString(item, parameters);
        if (!output.includes(interpolated)) {
          return `Output did not contain '${item}'`;
        }
      }
    }
  }

  private static validateFiles(fileValidation: FileValidation | undefined, directory: string, parameters: InterpolateParameters) {
    if (!fileValidation){
      return;
    }
    for (const key of Object.keys(fileValidation)) {
      const { shouldExist, shouldContain } = fileValidation[key];
      
      if (!shouldExist && !shouldContain) {
        continue;
      }

      const filename = Utils.interpolateString(key, parameters);

      var path = join(process.cwd(), directory, filename);
      if (shouldExist !== undefined) {
        const exists = fs.existsSync(path);
        if (exists !== shouldExist) {
          return `Expected ${path} exists to be ${shouldExist}, but got ${exists}`
        }
      }

      if (shouldContain) {
        const content = fs.readFileSync(path);
        for (const item of shouldContain) {
          const interpolated = Utils.interpolateString(item, parameters);
          if (!content.includes(interpolated)) {
            return `File ${filename} did not contain '${interpolated}'`;
          }
        }
      }
    }
  }

  private static runCommandChain(
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
        const stdoutValidationError = this.validateOutput(validation.stdout, stdout, parameters);
        const stderrValidationError = this.validateOutput(validation.stderr, stderr, parameters);
        const fileValidationError = this.validateFiles(validation.files, directory, parameters);
        if (stdoutValidationError || stderrValidationError || fileValidationError) {
          results[command] = {
            run: true,
            passed: false,
            failureMessage: `stdout: ${stdoutValidationError}\nstderr: ${stderrValidationError}\nfiles: ${fileValidationError}`,
            stdout,
            stderr,
          }
        } else {
          results[command] = {
            run: true,
            passed: true,
            stdout,
            stderr,
          }
        }
        
        // Recursive call for the rest of the chain
        this.runCommandChain(directory, validations.slice(1, validations.length), results, onFinish, parameters);
        console.log(`${dirName} '${command}' finished`);
      },
      (stdout, stderr) => {
        const message = `stdout: ${stdout}stderr: ${stderr}`
        results[command] = {
          run: true,
          passed: false,
          failureMessage: message,
          stdout,
          stderr,
        }
        throw new Error(`ERROR during '${command}' in '${dirName}':\n\t${message}`);      
      }
    )
  }

  private static initializeResultSet(directories: string[], validations: CommandValidation[]): ResultSet {
    const results: ResultSet = {};
    for (const d of directories) {
      const dirName = Utils.getDirName(d);
      for (const v of validations) {
        if (!(dirName in results)) {
          results[dirName] = {}
        }
        results[dirName][v.command] = {
          passed: false,
          run: false
        }
      }
    }
    return results;
  }
}
