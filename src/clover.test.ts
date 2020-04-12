import { run } from "./clover";
import { CloverTest, ResultSet, TestResult } from "./models";

jest.mock("./logger");

describe("Clover", () => {
  it("runs a single test", async () => {
    const tests: CloverTest[] = [
      {
        validations: [
          {
            command: "echo hello",
            stdout: {
              shouldBeExactly: "hello\n",
            }
          }
        ]
      }
    ]
    await run(tests);
    tests.forEach((test) => {
      const results = test.results as ResultSet;
      expect(results).toBeDefined();
      
      const keys = Object.keys(results);
      expect(keys.length).toBe(1);
      
      const directoryResult = results[keys[0]];
      const directoryResultKeys = Object.keys(directoryResult);
      expect(directoryResultKeys.length).toBe(1);

      const testResult = directoryResult[directoryResultKeys[0]];
      expect(testResult.passed).toBe(true);
      expect(testResult.run).toBe(true);
      expect(testResult.stdout).toEqual("hello\n");
      expect(testResult.stderr).toEqual("");
      expect(testResult.failureMessage).toBeUndefined();
    });
  });

  it("commands actually perform the actions", async () => {

  });

  it("runs multiple independent commands", async () => {

  });

  it("runs multiple chained commands", async () => {
    const tests: CloverTest[] = [
      {
        validations: [
          {
            command: "touch output.txt",
            files: {
              "output.txt": {
                shouldExist: true,
              }
            }
          },
          {
            command: "ls",
            stdout: {
              shouldContain: [
                "output.txt"
              ]
            },
            files: {
              "output.txt": {
                shouldExist: true,
              }
            }
          },
          {
            command: "rm -rf output.txt",
            files: {
              "output.txt": {
                shouldExist: false,
              }
            }
          }
        ]
      }
    ]
    await run(tests);
    allTestsPassed(tests);
  });

  it("throws an error if command fails", async () => {
    const tests: CloverTest[] = [
      {
        validations: [
          {
            command: "cat fakeFile.txt",
          }
        ]
      }
    ]
    await expect(run(tests)).rejects.toThrow();
  });

  it("does not run empty directory set", async () => {
    const tests: CloverTest[] = [
      {
        validations: [
          {
            command: "echo hello",
            stdout: {
              shouldBeExactly: "hello\n",
            }
          }
        ],
        directories: []
      }
    ]
    await expect(run(tests)).rejects.toThrow();
    noTestsRun(tests);
  });

  it("runs test with the default summarizer", async () => {

  });

  it("runs test with a custom summarizer", async () => {

  });

  function allTestsAssertion(tests: CloverTest[], assertion: (result: TestResult) => void) {
    tests.forEach((test) => {
      const results = test.results as ResultSet;
      expect(results).toBeDefined();
      for (const dir of Object.keys(results)) {
        const dirResults = results[dir];
        for (const command of Object.keys(dirResults)) {
          assertion(dirResults[command]);
        }
      }
    });
  }

  function noTestsRun(tests: CloverTest[]) {
    tests.forEach((test) => {
      const results = test.results as ResultSet;
      expect(results).toBeUndefined();
    });
  }

  function allTestsPassed(tests: CloverTest[]) {
    allTestsAssertion(tests, (testResult) => {
      const { run, passed, failureMessage } = testResult;
      expect(run).toBe(true);
      expect(failureMessage).toBeUndefined();
      expect(passed).toBe(true);
    });
  }
})