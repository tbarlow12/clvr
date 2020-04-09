import fs from "fs";
import { join } from "path";
import { FileValidation, InterpolateParameters, OutputValidation, CommandValidation, ResultSet, DirectoryResultSet } from "./models";
import { Utils } from "./utils";

export class Validator {

  public static validate(
      validation: CommandValidation,
      directory: string,
      stdout: string,
      stderr: string,
      parameters: InterpolateParameters,
      results: DirectoryResultSet) {
    
    const stdoutValidationError = this.validateOutput(validation.stdout, stdout, parameters);
    const stderrValidationError = this.validateOutput(validation.stderr, stderr, parameters);
    const fileValidationError = this.validateFiles(validation.files, directory, parameters);
    if (stdoutValidationError || stderrValidationError || fileValidationError) {
      let failureMessage = "";
      if (stdoutValidationError) {
        failureMessage += `${stdoutValidationError}\n`
      }
      if (stderrValidationError) {
        failureMessage += `${stderrValidationError}\n`
      }
      if (fileValidationError) {
        failureMessage += `${fileValidationError}\n`
      }
      results[validation.command] = {
        run: true,
        passed: false,
        failureMessage,
        stdout,
        stderr,
      }
    } else {
      results[validation.command] = {
        run: true,
        passed: true,
        stdout,
        stderr,
      }
    }
  }
  
  private static validateOutput(
    outputValidation: OutputValidation|undefined,
    output: string,
    parameters: InterpolateParameters): string | undefined {
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

  private static validateFiles(
      fileValidation: FileValidation | undefined,
      directory: string,
      parameters: InterpolateParameters): string | undefined {
    if (!fileValidation){
      return;
    }

    for (const key of Object.keys(fileValidation)) {
      const { shouldExist, shouldContain } = fileValidation[key];
      
      if (shouldExist === false && !shouldContain) {
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
}