import { Clover } from "./clover";
import { CloverTest, ResultSet } from "./models";

describe("Clover", () => {

  it("runs a single test", async () => {
    var tests: CloverTest[] = [
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
    await Clover.run(tests);
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
})