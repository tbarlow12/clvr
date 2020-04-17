import { InterpolateParameters } from "./models"
import { Utils } from "./utils"
import assert, { AssertionError } from "assert";
import fs from "fs";

export class Assert {

  private parameters: InterpolateParameters;

  public constructor(parameters: InterpolateParameters) {
    this.parameters = parameters;
  }
  
  public empty(actual: string): void {
    if (actual !== "") {
      this.fail(`Expected an empty string, but got '${actual}'`);
    }
  }

  public notEmpty(actual: string): void {
    if (actual === "") {
      this.fail(`Expected not to be empty`);
    }
  }

  public exactly(actual: string, expected: string): void {
    if (actual !== expected) {
      this.fail(`Expected '${expected}' Actual '${actual}'`)
    }
    assert.equal(actual, this.interpolate(expected));
  }

  public contains(actual: string, expected: string): void {
    const interpolated = this.interpolate(expected);
    if (!actual.includes(interpolated)) {
      this.fail(`Output does not contain '${interpolated}'`);
    }
  }

  public doesNotContain(actual: string, expected: string): void {
    const interpolated = this.interpolate(expected);
    if (actual.includes(interpolated)) {
      this.fail(`Output should not contain '${interpolated}'`);
    }
  }

  public containsAll(actual: string, substrings: string[]): void {
    substrings.forEach(s => this.contains(actual, s));
  }

  public containsNone(actual: string, substrings: string[]): void {
    substrings.forEach(s => this.doesNotContain(actual, s));
  }

  public fileExists(path: string, shouldExist: boolean): void {
    const exists = fs.existsSync(path);
    if (exists !== shouldExist) {
      this.fail(`Expected file ${path} to exist: ${shouldExist} File exists: ${exists}`)
    }
  }

  private interpolate(expected: string): string {
    return Utils.interpolateString(expected, this.parameters);
  }

  private fail(message: string) {
    throw new AssertionError({message});
  }
}