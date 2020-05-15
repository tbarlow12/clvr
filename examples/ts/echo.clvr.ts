import clvr from "clvr";

clvr({
  name: "echo typescript",
  validations: [
    {
      command: "echo hello",
      stdout: {
        shouldBeExactly: "hello\n"
      }
    }
  ]
});