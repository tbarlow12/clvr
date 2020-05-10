import { ResultSet } from "./models/results";
import { Summarizers } from "./summarizers";

jest.mock("./logger");

describe("Summarizers", () => {
  let failing: ResultSet;
  let passing: ResultSet;

  beforeEach(() => {
    failing = getResultSet(false);
    passing = getResultSet();
  });
  
  it("brief failing", () => {
    expect(() => Summarizers.brief(failing)).toThrowError("Failed 1 of 2 tests");
  });

  it("verbose failing", () => {
    expect(() => Summarizers.verbose(failing)).toThrowError("Failed 1 of 2 tests");
  });

  function getResultSet(passing = true): ResultSet {
    return {
      "directory": {
        "ls": {
          directory: "directory",
          command: "ls",
          passed: true,
          failureMessage: "This test failed",
          run: true,
          stdout: "Hello",
          stderr: "",
        },
        "echo hi": {
          directory: "directory",
          command: "ls",
          passed: passing,
          run: true,
          stdout: "Hi",
          stderr: "",
        }
      }
    }
  }
});