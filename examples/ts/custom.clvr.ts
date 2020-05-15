import clvr from "clvr";
import { AssertionError } from "assert";

clvr({
  name: "custom typescript",
  validations: [
    {
      command: "ls",
      custom: (parameters, directory, stdout, stderr) => {
        if (parameters["dirName"] === "dir1" && !stdout.includes("hello.txt")) {
          throw new AssertionError({ message: "dir1 should have hello.txt" });
        }
        if (parameters["dirName"] === "dir2" && !stdout.includes("hi.txt")) {
          throw new AssertionError({ message: "dir2 should have hi.txt" });
        }
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
