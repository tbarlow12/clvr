# 🍀 Clover - The Command-Line Validator

[![codecov](https://codecov.io/gh/tbarlow12/clvr/branch/master/graph/badge.svg)](https://codecov.io/gh/tbarlow12/clvr) [![npm version](https://badge.fury.io/js/clvr.svg)](https://badge.fury.io/js/clvr) ![Build, Test and Coverage](https://github.com/tbarlow12/clvr/workflows/Build,%20Test%20and%20Coverage/badge.svg)

Clover is a simple way to validate the results of your command-line application. The test format is a JSON object that makes assertions based on the results of the executed command.

You can make assertions against `stdout`, `stderr`, files, or even a custom predicate function where you can make your own assertion.

## Table of Contents

- [🍀 Clover - The Command-Line Validator](#%f0%9f%8d%80-clover---the-command-line-validator)
  - [Table of Contents](#table-of-contents)
  - [About Clover](#about-clover)
    - [How It Works](#how-it-works)
    - [CloverTest](#clovertest)
    - [Types of Assertions](#types-of-assertions)
  - [Run Your First Test](#run-your-first-test)
  - [Examples](#examples)
    - [Simple Test](#simple-test)
    - [Simple Parameterized Test](#simple-parameterized-test)
    - [Custom Evaluator](#custom-evaluator)

## About Clover

Clover was born out of a need to validate the output and results of the [Azure Functions plugin](https://github.com/serverless/serverless-azure-functions) to the [Serverless Framework](https://github.com/serverless/serverless). There was no real integration tests being run, and we needed a simple way to make sure that the plugin was still able to perform its core operations across many different configurations. I named it Clover because it was a **C**ommand-**L**ine **V**alidato**r**, and it just so happened that the first beta package was released on St. Patrick's Day, 2020.

### How It Works

Clover iterates across the different directories and spawns a new process for each command validation. The commands in a test are executed in a sequential chain, so if one spawned command fails (fails to run, not failed assertion), the following commands will not be spawned. This allows tests for different directories to be run at the same time and allows for assertions based on the state after executing each command.

Clover uses `cross-spawn`, so valid commands can be executed on any operating system.

### CloverTest

The `run` function takes an array of type `CloverTest`. Here is the structure of that object:

```typescript
export interface CloverTest {
  /**
   * The only required property. Array of commands to 
  * execute along with their accompanying assertions.
  */
  validations: CommandValidation[];
  /**
   * Name of test to be used in output
  */
  name?: string;
  /**
   * Directories in which to execute the commands.
  * Relative to the current working directory.
  */
  directories?: string[];
  /**
   * String parameters for string interpolation in commands, 
  * paths or assertions. Broken down by directory.
  */
  parameters?: Parameters;
  /**
   * Should not be added by user. Because this is an
  * asynchronous process, each test result is attached to
  * the test object from which it came. The results are
  * printed out at the end of all test executions.
  */
  results?: ResultSet;
}
```

As you can see, the only required attribute in a `CloverTest` is `validations`, which is an array of type `CommandValidation`. These contain the commands to execute as well as all assertions to make as a result of the command being run.

### Types of Assertions

Each command can make 0 or many assertions. Here are the types of assertions that can be used:

- `stdout` - Assertions based on stdout of command
  - `shouldBeExactly` - `string` - The output should be *exactly* this string.
  - `shouldContain` - `string[]` - The output should contain ALL of these strings.
  - `shouldNotContain` - `string[]` - The output should contain NONE of these strings.
  - `isEmpty` - `boolean` - Specifies whether or not the output should be empty
- `stderr` - Assertions based on stderr of command
  - `shouldBeExactly` - `string` - The output should be *exactly* this string.
  - `shouldContain` - `string[]` - The output should contain ALL of these strings.
  - `shouldNotContain` - `string[]` - The output should contain NONE of these strings.
  - `isEmpty` - `boolean` - Specifies whether or not the output should be empty
- `files` - Assertions based on file states as result of command
  - `shouldExist` - `boolean` - Specifies whether or not the file should exist
  - `shouldBeExactly` - `string` - The file content should be *exactly* this string.
  - `shouldContain` - `string[]` - The file content should contain ALL of these strings.
  - `shouldNotContain` - `string[]` - The file content should contain NONE of these strings.
  - `isEmpty` - `boolean` - Specifies whether or not the file should exist
- `custom` - `(parameters: InterpolateParameters, stdout: string, stderr: string) => void` - Create custom function to evaluate output. For an error to be caught by results, `throw new AssertionError({message: "<your-message>"});`

## Run Your First Test
1. `npm install clvr`
2. Create `run.js` file and import the `run` function from `clvr`:
    
    ```javascript
    const { run } = require("clvr");
    ```
3. Run a `CloverTest` Array
   
    The `run` function takes in an array of `CloverTest` (see above).

    An example usage of `run` could be as simple as:
    ```javascript
    const { run } = require("clvr");

    run([
      {
        validations: [
          {
            command: "echo hello",
            stdout: {
              shouldBeExactly: "hello\n"
            }
          },
        ],
      }
    ]);
    ```
    Run your test:

    ```bash
    $ node test.js
    ```
    You should see the following results:
    ```bash
    PASSED - . - echo hello # Green
    stdout: # Green
    hello #Green
    ```
    If we were to make it fail by substituting `hi` for `hello` in our assertion, we would see:

    ```bash
    # This will all be in red
    FAILED - . - echo hello - Expected 'hi
    ' Actual 'hello
    '
    stdout:
    hello
    ```

## Examples

### Simple Test

```javascript
const { run } = require("clvr");

run([
  {
    name: "Simple Tests",
    validations: [
      {
        command: "echo hello",
        stdout: {
          shouldBeExactly: "hello\n"
        }
      },
      {
        command: "ls",
        stdout: {
          shouldNotContain: [
            "file.txt"
          ]
        }
      },
      {
        command: "touch file.txt",
        files: {
          "file.txt": {
            shouldExist: true,
            shouldBeExactly: ""
          }
        }
      },
      {
        command: "ls",
        stdout: {
          shouldContain: [
            "file.txt"
          ]
        },
        // You can have multiple assertion
        // types in one command validation
        files: {
          "file.txt": {
            shouldExist: true,
            shouldBeExactly: ""
          }
        }
      },
      {
        command: "rm file.txt",
        files: {
          "file.txt": {
            shouldExist: false,
          }
        }
      }
    ]
  }
]);
```

### Simple Parameterized Test

Let's assume the following file structure:

```
| dir1
  - hello.txt
| dir2
  - hi.txt
```
and each of those `.txt` files contains `hello!` or `hi!` respectively:

```javascript
const { run } = require("clvr");

run([
  {
    name: "Simple Parameterized Tests",
    directories: [
      "dir1",
      "dir2",
    ]
    parameters: {
      dir1: {
        value: "hello",
        fileName: "hello.txt",
      },
      dir2: {
        value: "hi",
        fileName: "hi.txt",
      }
    }
    validations: [
      {
        command: "cat ${fileName}",
        stdout: {
          shouldBeExactly: "${value}"
        },
        files: {
          "${fileName}": {
            shouldExist: true,
            shouldBeExactly: "${value}"
          }
        }
      },
      {
        command: "rm ${fileName}",
        files: {
          "${fileName}": {
            shouldExist: false,
          }
        }
      }
    ],
  }
]);
```

### Custom Evaluator

```javascript
const { run } = require("clvr");

run([
  {
    name: "Simple Parameterized Tests",
    directories: [
      "dir1",
      "dir2",
    ]
    parameters: {
      dir1: {
        value: "hello",
        fileName: "hello.txt",
      },
      dir2: {
        value: "hi",
        fileName: "hi.txt",
      }
    }
    validations: [
      {
        command: "cat ${fileName}",
        custom: (parameters, stdout, stderr) => {
          if (stdout !== parameters["value"] + "\n") {
            throw new AssertionError({message: "File did not have correct value"});
          }
        }
      },
      {
        command: "rm ${fileName}",
        files: {
          "${fileName}": {
            shouldExist: false,
          }
        }
      }
    ],
  }
]);
```