import { Config } from "./config"
import { join } from "path";

jest.mock("./program");
import { Program } from "./program"

jest.mock("../utils/logger");

describe("Config", () => {
  it("gets test files with no filter", () => {
    Program.prototype.getConfig = jest.fn(() => "test/clvr.config.json") as any;
    const config = new Config();
    const tests = config.getTests();
    expect(tests).toEqual([
      join("test", "echo.clvr.ts"),
      join("test", "ls.clvr.ts")
    ]);
  });

  it("gets test files with a filter", () => {
    Program.prototype.getConfig = jest.fn(() => "test/clvr.config.json") as any;
    Program.prototype.getTests = jest.fn(() => "ls") as any;
    const config = new Config();
    const tests = config.getTests();
    expect(tests).toEqual([
      join("test", "ls.clvr.ts")
    ]);
  });

  it("gets directories with no filter", () => {
    Program.prototype.getConfig = jest.fn(() => "test/clvr.config.json") as any;
    const config = new Config();
    const directories = config.getDirectories();
    expect(directories).toEqual([
      join("test", "directories", "dir1"),
      join("test", "directories", "dir2"),
    ]);
  });

  it("gets directories with a filter", () => {
    Program.prototype.getConfig = jest.fn(() => "test/clvr.config.json") as any;
    Program.prototype.getDirectories = jest.fn(() => "dir1") as any;

    const config = new Config();
    const directories = config.getDirectories();
    expect(directories).toEqual([
      join("test", "directories", "dir1"),
    ]);
  });
});
