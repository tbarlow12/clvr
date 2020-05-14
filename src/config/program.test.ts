import { Program, CliArg } from "./program"

jest.mock("commander");
import commander from "commander";

describe("Program", () => {

  let program: Program;
  
  beforeEach(() => {
    commander[CliArg.CONFIG] = CliArg.CONFIG
    commander[CliArg.TESTS] = CliArg.TESTS;
    commander[CliArg.DIRECTORIES] = CliArg.DIRECTORIES;
    commander[CliArg.PARENT] = CliArg.PARENT;
    commander.version = jest.fn(() => commander);
    commander.description = jest.fn(() => commander) as any;
    commander.option = jest.fn(() => commander);
    commander.parse = jest.fn(() => commander);
    program = new Program();
  });

  it("sets up commander", () => {
    expect(commander.version).toBeCalled();
    expect(commander.description).toBeCalled();
    expect(commander.option).toBeCalledTimes(4);
    expect(commander.parse).toBeCalled();
  });

  it("gets config", () => {
    expect(program.getConfig()).toEqual(CliArg.CONFIG);
  });

  it("gets parent", () => {
    expect(program.getParent()).toEqual(CliArg.PARENT);
  });

  it("gets tests", () => {
    expect(program.getTests()).toEqual(CliArg.TESTS);
  });

  it("gets directories", () => {
    expect(program.getDirectories()).toEqual(CliArg.DIRECTORIES);
  });
});
