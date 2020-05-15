import { Program, CliArg } from "./program"

jest.mock("commander");
import commander from "commander";

describe("Program", () => {

  let program: Program;
  
  beforeEach(() => {
    commander[CliArg.CONFIG] = CliArg.CONFIG
    commander[CliArg.TEST_FILTER] = CliArg.TEST_FILTER;
    commander[CliArg.DIR_FILTER] = CliArg.DIR_FILTER;
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
    expect(program.getTestFilter()).toEqual(CliArg.TEST_FILTER);
  });

  it("gets directories", () => {
    expect(program.getDirFilter()).toEqual(CliArg.DIR_FILTER);
  });
});
