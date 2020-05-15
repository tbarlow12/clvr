import clvr from "clvr";

clvr({
  name: "ls typescript",
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
