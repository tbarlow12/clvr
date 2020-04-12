import fs from "fs";
import { join } from "path";
import { FileValidation, InterpolateParameters, OutputValidation, CommandValidation, ResultSet, DirectoryResultSet } from "./models";
import { Utils } from "./utils";
import assert, { AssertionError } from "assert";

export class Validator {

  public static validate(
    validation: CommandValidation,
    directory: string,
    stdout: string,
    stderr: string,
    parameters: InterpolateParameters,
    results: DirectoryResultSet) {

    let failureMessage = undefined;
    let passed: boolean = false;

    try {
      this.validateOutput(validation.stdout, stdout, parameters);
      this.validateOutput(validation.stderr, stderr, parameters);
      this.validateFiles(validation.files, directory, parameters);
      this.validateCustom(validation.custom, stdout, stderr, parameters);
      passed = true;
    } catch (err) {
      if (err instanceof AssertionError) {
        failureMessage = JSON.stringify(err);
      }
    }

    results[validation.command] = {
      directory,
      command: validation.command,
      run: true,
      passed,
      failureMessage,
      stdout,
      stderr,
    }
  }
  
  private static validateOutput(
    outputValidation: OutputValidation|undefined,
    output: string,
    parameters: InterpolateParameters): string | undefined {
    if (!outputValidation) {
      return;
    }
    
    const {
      shouldBeExactly,
      shouldContain,
      shouldNotContain,
      isEmpty,
    } = outputValidation;

    if (shouldBeExactly && shouldContain) {
      throw new Error("Can't specify both `shouldBeExactly` and `shouldContain`");
    }

    if (isEmpty === false) {
      assert.notEqual(output, "");
    }

    if (isEmpty) {
      assert.equal(output, "");
    }

    if (shouldBeExactly) {
      const interpolated = Utils.interpolateString(shouldBeExactly, parameters);
      assert.equal(output, interpolated);
    }

    if (shouldContain) {
      for (const item of shouldContain) {
        const interpolated = Utils.interpolateString(item, parameters);
        assert.equal(output.includes(interpolated), true, `Output does not contain '${interpolated}'`);
      }
    }

    if (shouldNotContain) {
      for (const item of shouldNotContain) {
        const interpolated = Utils.interpolateString(item, parameters);
        assert.equal(output.includes(interpolated), false, `Output contains '${interpolated}'`);
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
      const { shouldExist, shouldContain, shouldBeExactly } = fileValidation[key];
      
      if (shouldExist === undefined && !shouldContain && !shouldBeExactly) {
        continue;
      }

      const filename = Utils.interpolateString(key, parameters);

      const path = join(process.cwd(), directory, filename);
      if (shouldExist !== undefined) {
        const exists = fs.existsSync(path);
        assert.equal(exists, shouldExist);
      }

      if (shouldContain) {
        const content = fs.readFileSync(path).toString();
        for (const item of shouldContain) {
          const interpolated = Utils.interpolateString(item, parameters);
          assert.equal(content.includes(interpolated), true, `Content does not contain '${interpolated}'`);
        }
      }

      if (shouldBeExactly) {
        const content = fs.readFileSync(path).toString();
        const interpolated = Utils.interpolateString(shouldBeExactly, parameters);
        assert.equal(content, interpolated);
      }
    }
  }

  private static validateCustom (
    custom: {(parameters: InterpolateParameters, stdout: string, stderr: string): void} | undefined,
    stdout: string,
    stderr: string,
    parameters: InterpolateParameters) {
    if (!custom) {
      return;
    }
    return custom(parameters, stdout, stderr);
  }
}