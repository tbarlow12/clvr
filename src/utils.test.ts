import { Utils } from "./utils";
import { join } from "path";

describe("Utils", () => {
  it("getDirectories", () => {
    expect(Utils.getDirectories("src")).toEqual(["models"])
  });

  it("getDirName", () => {
    expect(Utils.getDirName(join("dir1", "dir2", "dir3").toString()))
      .toEqual("dir3");
    expect(Utils.getDirName("dir1/dir2/dir3")).toEqual("dir3");
    expect(Utils.getDirName("dir1")).toEqual("dir1");
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

  it("interpolateString without variable", () => {
    expect(Utils.interpolateString("hello malone", { name: "stockton" }))
      .toEqual("hello malone");
  });
});