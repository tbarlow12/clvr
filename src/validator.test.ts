import { Validator } from "./validator"
import { CommandValidation, ResultSet, DirectoryResultSet, InterpolateParameters } from "./models";
import assert from "assert";

describe("Validator", () => {
  const command = "stub command";
  describe("stdout", () => {
    describe("expect to pass", () => {
      it("shouldBeExactly", () => {
        const validation: CommandValidation = {
          command,
          stdout: {
            shouldBeExactly: "hello"
          }
        }
        const results = initial();
        Validator.validate(validation, "", "hello", "", {}, results);
        expectPass(results);
      });

      it("shouldContain", () => {
        const validation: CommandValidation = {
          command,
          stdout: {
            shouldContain: [ "hel", "o", "lo" ]
          }
        }
        const results = initial();
        Validator.validate(validation, "", "hello", "", {}, results);
        expectPass(results);
      });

      it("shouldNotContain", () => {
        const validation: CommandValidation = {
          command,
          stdout: {
            shouldNotContain: [ "123", "hi", "helloooo" ]
          }
        }
        const results = initial();
        Validator.validate(validation, "", "hello", "", {}, results);
        expectPass(results);
      });

      it("isEmpty true", () => {
        const validation: CommandValidation = {
          command,
          stdout: {
            isEmpty: true
          }
        }
        const results = initial();
        Validator.validate(validation, "", "", "", {}, results);
        expectPass(results);
      });

      it("isEmpty false", () => {
        const validation: CommandValidation = {
          command,
          stdout: {
            isEmpty: false
          }
        }
        const results = initial();
        Validator.validate(validation, "", "hello", "", {}, results);
        expectPass(results);
      });
    });
    
    describe("expect to fail", () => {
      it("shouldBeExactly", () => {
        const validation: CommandValidation = {
          command,
          stdout: {
            shouldBeExactly: "hello"
          }
        }
        const results = initial();
        Validator.validate(validation, "", "hi", "", {}, results);
        expectFail(results);
      });

      it("shouldContain", () => {
        const validation: CommandValidation = {
          command,
          stdout: {
            shouldContain: [ "he", "o", "lo" ]
          }
        }
        const results = initial();
        Validator.validate(validation, "", "hey", "", {}, results);
        expectFail(results);
      });

      it("shouldNotContain", () => {
        const validation: CommandValidation = {
          command,
          stdout: {
            shouldNotContain: [ "123", "hi", "helloooo" ]
          }
        }
        const results = initial();
        Validator.validate(validation, "", "hi", "", {}, results);
        expectFail(results);
      });

      it("isEmpty true", () => {
        const validation: CommandValidation = {
          command,
          stdout: {
            isEmpty: true
          }
        }
        const results = initial();
        Validator.validate(validation, "", "hello", "", {}, results);
        expectFail(results);
      });

      it("isEmpty false", () => {
        const validation: CommandValidation = {
          command,
          stdout: {
            isEmpty: false
          }
        }
        const results = initial();
        Validator.validate(validation, "", "", "", {}, results);
        expectFail(results);
      });
    });
  });

  describe("stderr", () => {
    describe("expect to pass", () => {
      it("shouldBeExactly", () => {
        const validation: CommandValidation = {
          command,
          stderr: {
            shouldBeExactly: "hello"
          }
        }
        const results = initial();
        Validator.validate(validation, "", "", "hello", {}, results);
        expectPass(results);
      });

      it("shouldContain", () => {
        const validation: CommandValidation = {
          command,
          stderr: {
            shouldContain: [ "hel", "o", "lo" ]
          }
        }
        const results = initial();
        Validator.validate(validation, "", "", "hello", {}, results);
        expectPass(results);
      });

      it("shouldNotContain", () => {
        const validation: CommandValidation = {
          command,
          stderr: {
            shouldNotContain: [ "123", "hi", "helloooo" ]
          }
        }
        const results = initial();
        Validator.validate(validation, "", "", "hello", {}, results);
        expectPass(results);
      });

      it("isEmpty true", () => {
        const validation: CommandValidation = {
          command,
          stderr: {
            isEmpty: true
          }
        }
        const results = initial();
        Validator.validate(validation, "", "", "", {}, results);
        expectPass(results);
      });

      it("isEmpty false", () => {
        const validation: CommandValidation = {
          command,
          stderr: {
            isEmpty: false
          }
        }
        const results = initial();
        Validator.validate(validation, "", "", "hello", {}, results);
        expectPass(results);
      });
    });
    
    describe("expect to fail", () => {
      it("shouldBeExactly", () => {
        const validation: CommandValidation = {
          command,
          stderr: {
            shouldBeExactly: "hello"
          }
        }
        const results = initial();
        Validator.validate(validation, "", "", "hi", {}, results);
        expectFail(results);
      });

      it("shouldContain", () => {
        const validation: CommandValidation = {
          command,
          stderr: {
            shouldContain: [ "he", "o", "lo" ]
          }
        }
        const results = initial();
        Validator.validate(validation, "", "", "hey", {}, results);
        expectFail(results);
      });

      it("shouldNotContain", () => {
        const validation: CommandValidation = {
          command,
          stderr: {
            shouldNotContain: [ "123", "hi", "helloooo" ]
          }
        }
        const results = initial();
        Validator.validate(validation, "", "", "hi", {}, results);
        expectFail(results);
      });

      it("isEmpty true", () => {
        const validation: CommandValidation = {
          command,
          stderr: {
            isEmpty: true
          }
        }
        const results = initial();
        Validator.validate(validation, "", "", "hello", {}, results);
        expectFail(results);
      });

      it("isEmpty false", () => {
        const validation: CommandValidation = {
          command,
          stderr: {
            isEmpty: false
          }
        }
        const results = initial();
        Validator.validate(validation, "", "", "", {}, results);
        expectFail(results);
      });
    });
  });

  describe("files", () => {
    describe("expect to pass", () => {
      it("shouldExist true", () => {
        const validation: CommandValidation = {
          command,
          files: {
            "package.json": {
              shouldExist: true
            }
          }
        }
        const results = initial();
        Validator.validate(validation, "", "", "", {}, results);
        expectPass(results);
      });

      it("shouldExist false", () => {
        const validation: CommandValidation = {
          command,
          files: {
            "blah.json": {
              shouldExist: false
            }
          }
        }
        const results = initial();
        Validator.validate(validation, "", "", "", {}, results);
        expectPass(results);
      });

      it("shouldContain", () => {
        const validation: CommandValidation = {
          command,
          files: {
            "package.json": {
              shouldContain: [ "Clover", "Validator" ]
            }
          }
        }
        const results = initial();
        Validator.validate(validation, "", "", "", {}, results);
        expectPass(results);
      });

      it("shouldBeExactly", () => {
        const validation: CommandValidation = {
          command,
          files: {
            "jest.setup.js": {
              shouldBeExactly: "jest.setTimeout(60000);"
            }
          }
        }
        const results = initial();
        Validator.validate(validation, "", "", "", {}, results);
        expectPass(results);
      });
    });

    describe("expect to fail", () => {
      it("shouldExist true", () => {
        const validation: CommandValidation = {
          command,
          files: {
            "blah.json": {
              shouldExist: true
            }
          }
        }
        const results = initial();
        Validator.validate(validation, "", "", "", {}, results);
        expectFail(results);
      });

      it("shouldExist false", () => {
        const validation: CommandValidation = {
          command,
          files: {
            "package.json": {
              shouldExist: false
            }
          }
        }
        const results = initial();
        Validator.validate(validation, "", "", "", {}, results);
        expectFail(results);
      });

      it("shouldContain", () => {
        const validation: CommandValidation = {
          command,
          files: {
            "package.json": {
              shouldContain: [ "doesNotContainThisString", "Clover" ]
            }
          }
        }
        const results = initial();
        Validator.validate(validation, "", "", "", {}, results);
        expectFail(results);
      });

      it("shouldBeExactly", () => {
        const validation: CommandValidation = {
          command,
          files: {
            "jest.setup.js": {
              shouldBeExactly: "not this"
            }
          }
        }
        const results = initial();
        Validator.validate(validation, "", "", "", {}, results);
        expectFail(results);
      });
    });
  });

  describe("custom", () => {
    it("expect to pass", () => {
      const validation: CommandValidation = {
        command,
        custom: (parameters, stdout, stderr) => {
          assert.equal(stdout, `hello ${parameters["param1"]}`);
          assert.equal(stderr, `hello ${parameters["param2"]}`);
        }
      }
      const results = initial();
      const parameters: InterpolateParameters = {
        param1: "bruce",
        param2: "clark",
      }
      Validator.validate(validation, "", "hello bruce", "hello clark", parameters, results);
      expectPass(results);
    });

    it("expect to fail", () => {
      const validation: CommandValidation = {
        command,
        custom: (parameters, stdout, stderr) => {
          assert.equal(stdout, `hello ${parameters["param1"]}`);
          assert.equal(stderr, `hello ${parameters["param2"]}`);
        }
      }
      const results = initial();
      const parameters: InterpolateParameters = {
        param1: "bruce",
        param2: "clark",
      }
      Validator.validate(validation, "", "hello clark", "hello bruce", parameters, results);
      expectFail(results);
    });
  });

  function expectPass(results: DirectoryResultSet) {
    const { run, passed } = results[command];
    expect(run).toBe(true);
    expect(passed).toBe(true);
  }
  
  function expectFail(results: DirectoryResultSet) {
    const { run, passed } = results[command];
    expect(run).toBe(true);
    expect(passed).toBe(false);
  }
  
  function initial(): DirectoryResultSet {
    const resultSet: DirectoryResultSet = {}
    resultSet[command] = {
      directory: ".",
      command,
      run: true,
      passed: false,
    }
    return resultSet
  }
});

