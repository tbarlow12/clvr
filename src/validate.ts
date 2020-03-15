import { InterpolateParameters } from "./parameters";
import { interpolateStrings } from "./utils";

export interface OutputValidation {
  shouldBeExactly?: string;
  shouldContain?: string[];
  shouldContainInterpolated?: string[];
}

export function validateOutput(expected: OutputValidation|undefined, output: string, parameters: InterpolateParameters) {
  if (!expected) {
    return;
  }
  const { shouldBeExactly, shouldContain, shouldContainInterpolated } = expected;
  if (shouldBeExactly && shouldContain) {
    throw new Error("Can't specify both `shouldBeExactly` and `shouldContain`");
  }
  if (shouldBeExactly) {
    if (output !== shouldBeExactly) {
      throw new Error(`Expected: ${shouldBeExactly}\nReceived: ${output}`);
    }
  }
  if (shouldContain) {
    for (const item of shouldContain) {
      if (!output.includes(item)) {
        throw new Error(`Output did not contain '${item}'`);
      }
    }
  }
  if (shouldContainInterpolated) {
    if (!parameters) {
      throw new Error("Cannot interpolate strings without parameters");
    }
    for (const interpolated of interpolateStrings(shouldContainInterpolated, parameters)) {
      if (!output.includes(interpolated)) {
        throw new Error(`Output did not contain '${interpolated}'`);
      }
    }
  }
}
