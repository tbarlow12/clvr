# 🍀 Clover - The Command-Line Validator

[![codecov](https://codecov.io/gh/tbarlow12/clvr/branch/master/graph/badge.svg)](https://codecov.io/gh/tbarlow12/clvr) [![npm version](https://badge.fury.io/js/clvr.svg)](https://badge.fury.io/js/clvr) [![Build, Test and Coverage](https://github.com/tbarlow12/clvr/workflows/Build,%20Test%20and%20Coverage/badge.svg)](https://github.com/tbarlow12/clvr/actions?query=workflow%3A%22Build%2C+Test+and+Coverage%22)

Clover is a simple way to validate the results of your command-line application. The test format is a JSON object that makes assertions based on the results of the executed command.

You can make assertions against `stdout`, `stderr`, files, or even a custom predicate function where you can make your own assertion.

## Table of Contents

- [🍀 Clover - The Command-Line Validator](#%f0%9f%8d%80-clover---the-command-line-validator)
  - [Table of Contents](#table-of-contents)
  - [About Clover](#about-clover)
    - [How It Works](#how-it-works)
  - [Getting Started](#getting-started)
    - [Run Your First Test](#run-your-first-test)
    - [Data Structures](#data-structures)
      - [Clover Config](#clover-config)
      - [Clover Test](#clover-test)
      - [CommandValidation](#commandvalidation)
    - [Types of Assertions](#types-of-assertions)
  - [Examples](#examples)
    - [Simple Test](#simple-test)
    - [Simple Parameterized Test](#simple-parameterized-test)
    - [Custom Evaluator](#custom-evaluator)
    - [Conditional Execution](#conditional-execution)

## About Clover

Clover was born out of a need to validate the output and results of the [Azure Functions plugin](https://github.com/serverless/serverless-azure-functions) to the [Serverless Framework](https://github.com/serverless/serverless). There were no real integration tests being run, and we needed a simple way to make sure that the plugin was still able to perform its core operations across many different configurations. I named it Clover because it was a **C**ommand-**L**ine **V**alidato**r**, and it just so happened that the first beta package was released on St. Patrick's Day, 2020.

### How It Works

Clover iterates across the different directories and spawns a new process for each command validation. The commands in a test are executed in a sequential chain, so if one spawned command fails (fails to run, not failed assertion), the following commands will not be spawned. This allows tests for different directories to be run at the same time and allows for assertions based on the state after executing each command.

Clover uses `cross-spawn`, so valid commands can be executed on any operating system.

## Getting Started

This section will be your guide to using Clover within your development process

### Run Your First Test

1. Install clvr
    ```bash
    $ npm i clvr
    ```
2. Create test file
    ```typescript
    // basic.clvr.ts
    import clvr from "clvr";

    clvr({
      validations: [
        {
          command: "echo hello",
          stdout: {
            shouldBeExactly: "hello\n"
          }
        }
      ]
    });
    ```
    This file can be a `.ts`, `.js` or even `.json` file. TypeScript and JavaScript allow for more custom assertions, but if you don't need that, `basic.clvr.json` would work just fine. Check out our [examples](./examples/) for TypeScript, JavaScript and JSON files.

    `clvr` will check the file extension and spawn the appropriate process to run the test.

3. Add `clvr` to your `package.json` scripts section:
    ```json
    {
      "scripts": {
        "clvr": "clvr"
      }
    }
    ```
4. Run `clvr`
    ```bash
    $ npm run clvr
    ```
    You should see output that looks something like:
    ```  
               _
         ___  | | __   __  _ __ 
        / __| | | \ \ / / | '__|
       | (__  | |  \ V /  | |   
        \___| |_|   \_/   |_|   

      Looking for tests matching pattern '**/*.clvr.@(ts|js)' 
      Running tests: basic.clvr.js 
      . 'echo hello' finished 
      PASSED - . - echo hello
      stdout:
      hello
      
      
      
      TEST RESULTS: 
      TOTAL: 1
      PASSED: 1
      SKIPPED: 0
      FAILED: 0 
      ```

### Data Structures

#### Clover Config

`clvr` can accept any `.json` file as config, when the path is given in the CLI via the `-c` flag (`clvr -c myconfig.json`). `clvr` will look for `clvr.config.json` by default. Here is the structure of the config:

```json
{
  "parentDir": "Path to parent of all test directories",
  "directoryFilter": "Filter for test directories",
  "testPattern": "Glob pattern for all test files. Default is **/*.clvr.@(ts|js|json)",
  "testFilter": "Filter for all test files",
  "runAsync": "Specifies if tests should be run asynchronously. Default is false"
}
```

A config file is not necessary. The default config could work just fine. If no `parentDir` or `directoryFilter` is specified, the tests will be run in your current working directory.

All of these options, with the exception of `testPattern` and `runAsync`, can be specified in the command line via their respective flags:

`parentDir` = `-p <value>`
`directoryFilter` = `-d <value>`
`testFilter` = `-t <value>`

For help on CLI options, you can always run:

```bash
$ clvr -h
```

#### Clover Test

The default exported function takes an object of type `CloverTest`. Here is the structure of that object:

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

#### CommandValidation

As you can see, the only required attribute in a `CloverTest` is `validations`, which is an array of type `CommandValidation`. These contain the commands to execute as well as all assertions to make as a result of the command being run. Here is the structure of the `CommandValidation` object:

```typescript
/**
 * Command to validate. Used as main configuration when defining
 * commands that need to be run and what their expected behavior is.
 */
export interface CommandValidation {
  /** 
   * Full string (including arguments) of command to run
   */
  command: string;
  /** 
   * Object that describes expected output to stdout 
   */
  stdout?: ContentValidation;
  /**
   * Object that describes expected output to stderr
   */
  stderr?: ContentValidation;
  /**
   * Object that describes expected state of files in directory after test is run
   */
  files?: FileStructureValidation;
  /**
   * Custom predicate for command result
   */
  custom?: {(parameters: InterpolateParameters, directory: string, stdout: string, stderr: string): void};
  /** 
   * Predicate condition that, if false, prevents the step from being run 
   */
  condition?: {(directory: string): boolean};
  /**
   * Does not print stdout from command (will still print stderr)
   */
  silent?: boolean
}
```

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

Helpful tip: things like `npm install` commands where you don't really care about the output, add `silent: true` to the validation object. 

## Examples

### Simple Test

```typescript
import clvr from "clvr";

clvr({
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
});
```

### Simple Parameterized Test

Let's assume the following file structure:

```
| dirs
  | dir1
    - hello.txt
  | dir2
    - hi.txt
```
and each of those `.txt` files contains `hello!` or `hi!` respectively.

We'll also TODO - CONFIG

```typescript
import clvr from "clvr";

clvr({
  name: "Simple Parameterized Tests",
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
});
```

### Custom Evaluator

```typescript
import clvr from "clvr";

clvr({
  name: "Simple Parameterized Tests",
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
      custom: (parameters, directory, stdout, stderr) => {
        if (directory === "dir1") {
          console.log("Got to dir1 directory");
        }
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
});
```

### Conditional Execution

```typescript
import clvr from "clvr";

clvr({
  name: "Simple Parameterized Tests",
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
      condition: (directory) => directory === "dirs/dir1"
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
});
```