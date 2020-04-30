import { runInternal } from "./clover";
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
    await runInternal(tests);
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
    await runInternal(tests);
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
    await expect(runInternal(tests)).rejects.toEqual(expect.any(String));
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
    await expect(runInternal(tests)).rejects.toEqual(expect.any(String));
    expect(tests).toHaveLength(1);
    expect(tests[0].results).toEqual({});
  });

  it("runs test with the default summarizer", async () => {

  });

  it("runs test with a custom summarizer", async () => {

  });

  it("skips test if condition returns false", async () => {
    const tests: CloverTest[] = [
      {
        validations: [
          {
            command: "cat ${fileName}",
            condition: (dir) => dir === "test/dir2",
            stdout: {
              shouldBeExactly: "Hi!",
            }
          }
        ],
        directories: [ "test/dir1", "test/dir2" ],
        parameters: {
          dir1: {
            fileName: "hello.txt",
            value: "Hello",
          },
          dir2: {
            fileName: "hi.txt",
            value: "Hi",
          }
        }
      }
    ]
    await runInternal(tests);

    const { results } = tests[0];

    expect(results).toBeDefined();

    // TypeScript undefined check
    if (results) {
      const { dir1, dir2 } = results;
      
      expect(dir1).toBeDefined();
      expect(dir2).toBeDefined();
  
      // dir1 should have been skipped
      const dir1Result = dir1["cat ${fileName}"];
      expect(dir1Result).toBeDefined();
      expect(dir1Result.passed).toBe(false);
      expect(dir1Result.run).toBe(false);
  
      // dir2 should have passed
      const dir2Result = dir2["cat ${fileName}"];
      expect(dir2Result).toBeDefined();
      expect(dir2Result.passed).toBe(true);
      expect(dir2Result.run).toBe(true);
    }
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

  function allTestsPassed(tests: CloverTest[]) {
    allTestsAssertion(tests, (testResult) => {
      const { run, passed, failureMessage } = testResult;
      expect(run).toBe(true);
      expect(failureMessage).toBeUndefined();
      expect(passed).toBe(true);
    });
  }
})