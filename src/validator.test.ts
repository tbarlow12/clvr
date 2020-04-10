import { Validator } from "./validator"
import { CommandValidation, ResultSet, DirectoryResultSet } from "./models";

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
      
    });
  });

  describe("stderr", () => {
    describe("expect to pass", () => {
      it("shouldBeExactly", () => {

      });

      it("shouldContain", () => {

      });

      it("shouldNotContain", () => {

      });

      it("isEmpty", () => {

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
      it("shouldExist", () => {

      });

      it("shouldContain", () => {

      });

      it("shouldBeExactly", () => {

      });
    });

    describe("expect to fail", () => {
      it("shouldExist", () => {

      });

      it("shouldContain", () => {

      });

      it("shouldBeExactly", () => {

      });
    });
  });

  describe("custom", () => {
    it("expect to pass", () => {

    });

    it("expect to fail", () => {

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
      run: true,
      passed: false,
    }
    return resultSet
  }
});

