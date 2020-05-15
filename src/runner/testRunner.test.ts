import path from "path";
import { runTestFiles } from "./testRunner";

jest.mock("../utils/utils");
import { Utils } from "../utils/utils";

jest.mock("./clover");
import { run } from "../runner/clover"

describe("Test Runner", () => {
  beforeEach(() => {
    Utils.createSpawn = jest.fn();
  });

  afterEach(() => {
    (Utils.createSpawn as any).mockReset();
  });

  it("runs typescript", async () => {
    await runTestFiles(["file.ts"]);
    const calls = (Utils.createSpawn as any).mock.calls;
    expect(calls).toHaveLength(1);
    const call = calls[0];
    expect(call[0]).toEqual(process.cwd());
    expect(call[1]).toEqual(path.join(process.cwd(), "node_modules", ".bin", "ts-node"));
    expect(call[2][0]).toEqual("file.ts");
    expect(call[3]).toEqual(expect.any(Function));
    expect(call[4]).toEqual(expect.any(Function));
    expect(call[5]).toBe(true);
    (Utils.createSpawn as any).mockReset();
    await calls[0][3]();
    expect(Utils.createSpawn).not.toBeCalled();
  });

  it("runs javascript", async () => {
    await runTestFiles(["file.js"]);
    const calls = (Utils.createSpawn as any).mock.calls;
    expect(calls).toHaveLength(1);
    const call = calls[0];
    expect(call[0]).toEqual(process.cwd());
    expect(call[1]).toEqual("node");
    expect(call[2][0]).toEqual("file.js");
    expect(call[3]).toEqual(expect.any(Function));
    expect(call[4]).toEqual(expect.any(Function));
    expect(call[5]).toBe(true);
  });

  it("runs JSON", async () => {
    await runTestFiles([path.join("test", "test.json")]);
    expect(run).toBeCalledWith({
      validations: [
        {
          command: "echo hello",
          stdout: {
            shouldBeExactly: "hello\n"
          }
        }
      ]
    });
  });

  it("does not run empty set", async () => {
    await runTestFiles([]);
    expect(Utils.createSpawn).not.toBeCalled();
  });

  it("throws exception for invalid file", async () => {
    await expect(runTestFiles(["file.cs"])).rejects.toThrow("Invalid file: file.cs");
  });
});