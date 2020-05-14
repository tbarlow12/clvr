import run from "../src";

run({
  validations: [
    {
      command: "ls",
      stdout: {
        shouldBeExactly: "${fileName}\n"
      }
    }
  ],
  parameters: {
    dir1: {
      fileName: "hello.txt"
    },
    dir2: {
      fileName: "hi.txt"
    }
  }
});
