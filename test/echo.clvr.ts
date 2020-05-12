import run from "../src";

run({
  validations: [
    {
      command: "echo hello",
      stdout: {
        shouldBeExactly: "hello\n"
      }
    }
  ]
});
