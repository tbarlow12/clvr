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