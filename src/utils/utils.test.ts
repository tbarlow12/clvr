import { Utils } from "./utils";
import { join } from "path";

describe("Utils", () => {
  it("getDirectories", () => {
    expect(Utils.getDirectories("test")).toEqual([join("test", "directories")]);
  });

  it("getDirName", () => {
    expect(Utils.getDirName(join("dir1", "dir2", "dir3").toString()))
      .toEqual("dir3");
    expect(Utils.getDirName("dir1/dir2/dir3")).toEqual("dir3");
    expect(Utils.getDirName("dir1")).toEqual("dir1");
    expect(Utils.getDirName("dir1/")).toEqual("dir1");
    expect(Utils.getDirName("dir1/dir2/dir3/")).toEqual("dir3");
  });

  it("getFileName", () => {
    expect(Utils.getFileName("dir1/dir2/dir3/file.txt")).toEqual("file.txt");
    expect(Utils.getFileName("file.txt")).toEqual("file.txt");
    expect(Utils.getFileName(join("dir1", "dir2", "dir3", "file.txt"))).toEqual("file.txt");
    expect(Utils.getFileName("dir1/")).toEqual("");
  });

  it("containsVariable true", () => {
    expect(Utils.containsVariable("hello ${name}")).toBe(true);
  });

  it("containsVariable false", () => {
    expect(Utils.containsVariable("hello ${name")).toBe(false);
    expect(Utils.containsVariable("hello {name}")).toBe(false);
    expect(Utils.containsVariable("hello $name}")).toBe(false);
  });

  it("interpolateString with variable", () => {
    expect(Utils.interpolateString("hello ${name}", { name: "stockton" }))
      .toEqual("hello stockton");

    expect(Utils.interpolateString("hello ${name} ${name", { name: "stockton" }))
      .toEqual("hello stockton ${name");
  });

  it("interpolateString with variable and environment variable", () => {
    const envVarKey = "TEST_VAR";
    const envVarValue = "TEST_VALUE";
    process.env[envVarKey] = envVarValue;
    expect(Utils.interpolateString("hello ${name} ${env:TEST_VAR}", { name: "stockton" }))
      .toEqual("hello stockton TEST_VALUE");
    delete process.env[envVarKey];
  });

  it("interpolateString without variable", () => {
    expect(Utils.interpolateString("hello malone", { name: "stockton" }))
      .toEqual("hello malone");
  });
  
  it("interpolateString with missing parameter throws error", () => {
    expect(() => Utils.interpolateString("hello ${name}", { }))
      .toThrow("Variable name not found in parameters");
  });

  it("interpolateString with missing environment variable throws error", () => {
    expect(() => Utils.interpolateString("hello ${env:INVALID_VAR}", { }))
      .toThrow("Environment Variable INVALID_VAR not found");
  });
});
