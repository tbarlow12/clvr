const clvr = require("clvr").default;

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