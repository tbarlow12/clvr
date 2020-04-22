# 🍀 Clover - The Command-Line Validator

[![codecov](https://codecov.io/gh/tbarlow12/clvr/branch/master/graph/badge.svg)](https://codecov.io/gh/tbarlow12/clvr)

Clover is a simple way to validate the results of your command-line application. The test format is a JSON object that makes assertions based on the results of the executed command.

You can make assertions against `stdout`, `stderr`, files, or even a custom predicate function where you can make your own assertion.

## Table of Contents

- [🍀 Clover - The Command-Line Validator](#%f0%9f%8d%80-clover---the-command-line-validator)
  - [Table of Contents](#table-of-contents)
    - [About Clover](#about-clover)
      - [How It Works](#how-it-works)
    - [Run Your First Test](#run-your-first-test)
      - [Required Properties](#required-properties)
      - [Optional Properties](#optional-properties)
    - [Run Your First Test](#run-your-first-test-1)
    - [Examples](#examples)
      - [Simple Test](#simple-test)
      - [Simple Parameterized Test](#simple-parameterized-test)
      - [](#)

### About Clover

Clover was born out of a need to validate the output and results of the [Azure Functions plugin](https://github.com/serverless/serverless-azure-functions) to the [Serverless Framework](https://github.com/serverless/serverless). There was no real integration tests being run, and we needed a simple way to make sure that the plugin was still able to perform its core operations across many different configurations. I named it Clover because it was a **C**ommand-**L**ine **V**alidato**r**, and it just so happened that the first beta package was released on St. Patrick's Day, 2020.

#### How It Works

Clover iterates across the different directories and spawns a new process for each command validation. The commands in a test are executed in a sequential chain, so if one spawned command fails (fails to run, not failed assertion), the following commands will not be spawned. This allows tests for different directories to be run at the same time and allows for assertions based on the state after executing each command.

Clover uses `cross-spawn`, so valid commands can be executed on any operating system.

### Run Your First Test
1. `npm install clvr`
2. Create `run.js` file and import the `run` function from `clvr`:
    ```javascript
    const { run } = require("clvr");
    ```
3. Build Your `CloverTest` Array
   
    The `run` function takes in an array of `CloverTest`. Because Clover is written in TypeScript, the easiest way to describe these objects is to include their interfaces along with the inline documentation. Here is the structure of `CloverTest`:

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
    An example `CloverTest` could be:
    ```json
    {
      "validations": [
        {
          "command": "echo hello",
          "stdout": {
            "shouldBeExactly": "hello\n"
          }
        },
      ],
    }
    ```

#### Required Properties

- `validations` - The only required property for a test. Array of `CommandValidation` to run with their associated assertions

```json
{
  "validations": [
    {
      "command": "echo hello",
      "stdout": {
        "shouldBeExactly": "hello\n"
      }
    },
  ],
}
```





#### Optional Properties

- `name` - Name of test
- `directories` - Array of directory paths on which to execute commands, relative to the current working directory. Default is `.`
- `parameters` - String parameters for string interpolation in commands, paths or assertions. Broken down by directory.

```json
{
  "validations": [
    {
      "name": "My Test",
      "directories": [
        "dir1",
        "dir2"
      ],
      "parameters": {
        "dir1": {
          "myValue": "hello"
        },
        "dir2": {
          "myValue": "hi"
        }
      },
      "command": "echo ${myValue}",
      "stdout": {
        "shouldBeExactly": "${myValue}\n"
      }
    },
  ],
}
```

### Run Your First Test

The `run` function takes in two arguments, but only requires the first: 
1. An array of `CloverTest` (shown above) 
2. An optional test result summarizer - defaults to `Summarizers.verbose`. Current valid summarizers: `Summarizers.verbose` and `Summarizers.brief`.

### Examples

#### Simple Test

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

#### Simple Parameterized Test

```javascript
const { run } = require("clvr");

run([
  {
    name: "Simple Parameterized Tests",
    parameters: {
      // Parameters are split up by directory, but since we 
      // are defaulting to the current working directory, we 
      // only need variables for that directory
      ".": {
        "testVar": "hello",
        "fileName": "file.txt",
      }
    }
    validations: [
      {
        command: "echo hello",
        stdout: {
          shouldBeExactly: "${testVar}\n"
        }
      },
      {
        command: "touch ${fileName}",
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
            "${fileName}"
          ]
        },
        files: {
          "file.txt": {
            shouldExist: true,
            shouldBeExactly: ""
          }
        }
      },
      {
        command: "rm ${fileName}",
        files: {
          "file.txt": {
            shouldExist: false,
          }
        }
      }
    ],
  }
]);
```

#### 