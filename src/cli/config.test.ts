import { Config } from "./config"
import { join } from "path";

jest.mock("./program");
import { Program } from "./program"

jest.mock("../utils/logger");

describe("Config", () => {
  it("gets test files with no filter", () => {
    Program.get = jest.fn(() => {
      return {
        config: "test/clvr.config.json"
      }
    }) as any;
    const config = new Config();
    const tests = config.getTests();
    expect(tests).toEqual([
      join("test", "echo.clvr.ts"),
      join("test", "ls.clvr.ts")
    ]);
  });

  it("gets test files with a filter", () => {
    Program.get = jest.fn(() => {
      return {
        config: "test/clvr.config.json",
        tests: "ls"
      }
    }) as any;
    const config = new Config();
    const tests = config.getTests();
    expect(tests).toEqual([
      join("test", "ls.clvr.ts")
    ]);
  });

  it("gets directories with no filter", () => {
    Program.get = jest.fn(() => {
      return {
        config: "test/clvr.config.json"
      }
    }) as any;
    const config = new Config();
    const directories = config.getDirectories();
    expect(directories).toEqual([
      join("test", "directories", "dir1"),
      join("test", "directories", "dir2"),
    ]);
  });

  it("gets directories with a filter", () => {
    Program.get = jest.fn(() => {
      return {
        config: "test/clvr.config.json",
        directories: "dir1"
      }
    }) as any;
    const config = new Config();
    const directories = config.getDirectories();
    expect(directories).toEqual([
      join("test", "directories", "dir1"),
    ]);
  });
});
