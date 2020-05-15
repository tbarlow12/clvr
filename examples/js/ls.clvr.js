const clvr = require("clvr").default;

clvr({
  name: "ls javascript",
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
      dirName: "dir1",
      fileName: "hello.txt"
    },
    dir2: {
      dirName: "dir2",
      fileName: "hi.txt"
    }
  }
});
