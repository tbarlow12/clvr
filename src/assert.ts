import { InterpolateParameters } from "./models"
import { Utils } from "./utils"
import assert from "assert";
import fs from "fs";

export class Assert {

  private parameters: InterpolateParameters;

  public constructor(parameters: InterpolateParameters) {
    this.parameters = parameters;
  }
  
  public empty(actual: string): void {
    assert.equal(actual, "");
  }

  public notEmpty(actual: string): void {
    assert.notEqual(actual, "");
  }

  public exactly(actual: string, expected: string): void {
    assert.equal(actual, this.interpolate(expected));
  }

  public contains(actual: string, expected: string): void {
    const interpolated = this.interpolate(expected);
    assert.equal(actual.includes(interpolated), true, `Output does not contain '${interpolated}'`);
  }

  public doesNotContain(actual: string, expected: string): void {
    const interpolated = this.interpolate(expected);
    assert.equal(actual.includes(interpolated), false, `Output should not contain '${interpolated}'`);
  }

  public containsAll(actual: string, substrings: string[]): void {
    substrings.forEach(s => this.contains(actual, s));
  }

  public containsNone(actual: string, substrings: string[]): void {
    substrings.forEach(s => this.doesNotContain(actual, s));
  }

  public fileExists(path: string, shouldExist: boolean): void {
    const exists = fs.existsSync(path);
    assert.equal(shouldExist, exists);
  }

  private interpolate(expected: string): string {
    return Utils.interpolateString(expected, this.parameters);
  }
}