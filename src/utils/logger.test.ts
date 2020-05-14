import { Logger } from "./logger"

jest.mock("chalk");
import chalk from "chalk";

describe("Logger", () => {
  // const cyanSpy = jest.spyOn(chalk, "cyan");
  // const greenBrightSpy = jest.spyOn(chalk, "greenBright");
  // const yellowSpy = jest.spyOn(chalk, "yellow");
  // const redSpy = jest.spyOn(chalk, "red");

  beforeAll(() => {
    console.log = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
    (chalk.cyan as any) = jest.fn((message) => message) as any;
    (chalk.greenBright as any) = jest.fn((message) => message) as any;
    (chalk.yellow as any) = jest.fn((message) => message) as any;
    (chalk.red as any) = jest.fn((message) => message) as any;
  });

  afterEach(() => {
    (console.log as any).mockClear();
    (console.warn as any).mockClear();
    (console.error as any).mockClear();
    (chalk.cyan as any).mockClear();
    (chalk.greenBright as any).mockClear();
    (chalk.yellow as any).mockClear();
    (chalk.red as any).mockClear();
  });

  afterAll(() => {
    (console.log as any).mockRestore();
    (console.warn as any).mockRestore();
    (console.error as any).mockRestore();
    (chalk.cyan as any).mockRestore();
    (chalk.greenBright as any).mockRestore();
    (chalk.yellow as any).mockRestore();
    (chalk.red as any).mockRestore();
  });

  it("logs in cyan", () => {
    Logger.log("hello");
    expect(chalk.cyan).toBeCalledWith("hello", []);
    expect(console.log).toBeCalledWith("hello");
  });

  it("logs in green", () => {
    Logger.green("hello");
    expect(chalk.greenBright).toBeCalledWith("hello", []);
    expect(console.log).toBeCalledWith("hello");
  });

  it("warns in yellow", () => {
    Logger.warn("hello");
    expect(chalk.yellow).toBeCalledWith("hello", []);
    expect(console.warn).toBeCalledWith("hello");
  });

  it("errors in red", () => {
    Logger.error("hello");
    expect(chalk.red).toBeCalledWith("hello", []);
    expect(console.error).toBeCalledWith("hello");
  });

  it("logs ascii art", () => {
    const chalkResult = "chalkResult";
    const chalkFn = jest.fn(() => chalkResult)
    Logger.asciiArt("hello", chalkFn);
    expect(chalkFn).toBeCalled();
    expect(console.log).toBeCalledWith(chalkResult);
  });

  it("pretty prints", () => {
    const item = { value: 1, otherValue: 2 }
    const expected = JSON.stringify(item, null, 2);
    Logger.prettyPrint(item);
    expect(console.log).toBeCalledWith(expected);
  });
});
