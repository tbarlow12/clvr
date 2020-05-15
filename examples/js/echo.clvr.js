const clvr = require("clvr").default;

clvr({
  name: "echo javascript",
  validations: [
    {
      command: "echo hello",
      stdout: {
        shouldBeExactly: "hello\n"
      }
    }
  ]
});