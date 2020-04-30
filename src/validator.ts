import { AssertionError } from "assert";
import fs from "fs";
import { join } from "path";
import { Assert } from "./assert";
import { CommandValidation, ContentValidation, DirectoryResultSet, FileStructureValidation, InterpolateParameters } from "./models";
import { Utils } from "./utils";

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
        failureMessage = err.message;
      } else {
        failureMessage = JSON.stringify(err, null, 2);
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
      silent: validation.silent,
    }
  }
  
  private static validateOutput(
    outputValidation: ContentValidation|undefined,
    output: string,
    parameters: InterpolateParameters): string | undefined {
    if (!outputValidation) {
      return;
    }
    
    this.validateContent(output, outputValidation, parameters);    
  }

  private static validateFiles(
    fileValidation: FileStructureValidation | undefined,
    directory: string,
    parameters: InterpolateParameters): string | undefined {
    
    if (!fileValidation){
      return;
    }

    const assert = new Assert(parameters);

    for (const key of Object.keys(fileValidation)) {
      const contentValidation = fileValidation[key];
      const filename = Utils.interpolateString(key, parameters);
      const path = join(process.cwd(), directory, filename);
      const { shouldExist } = contentValidation;
      
      if (shouldExist !== undefined) {
        assert.fileExists(path, shouldExist);
      }

      const content = fs.existsSync(path) ? fs.readFileSync(path).toString() : "";
      this.validateContent(content, contentValidation, parameters);
    }
  }

  private static validateContent(content: string, validation: ContentValidation, parameters: InterpolateParameters) {
    const assert = new Assert(parameters);
    const {
      shouldBeExactly,
      shouldContain,
      shouldNotContain,
      isEmpty,
    } = validation;

    if (shouldBeExactly && shouldContain) {
      throw new Error("Can't specify both `shouldBeExactly` and `shouldContain`");
    }

    if (isEmpty === false) {
      assert.notEmpty(content);
    }

    if (isEmpty) {
      assert.empty(content);
    }

    if (shouldBeExactly) {
      assert.exactly(content, shouldBeExactly);
    }

    if (shouldContain) {
      assert.containsAll(content, shouldContain);
    }

    if (shouldNotContain) {
      assert.containsNone(content, shouldNotContain);
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