import path from "path";
import { runTestFiles } from "./testRunner";

jest.mock("./utils");
import { Utils } from "./utils";

jest.mock("./clover");
import { run } from "./clover"

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
    expect(calls[0]).toEqual([
      process.cwd(),
      path.join(process.cwd(), "node_modules", ".bin", "ts-node"),
      [ "file.ts" ],
      expect.any(Function),
      expect.any(Function),
      true
    ]);
    (Utils.createSpawn as any).mockReset();
    await calls[0][3]();
    expect(Utils.createSpawn).not.toBeCalled();
  });

  it("runs javascript", async () => {
    await runTestFiles(["file.js"]);
    expect(Utils.createSpawn).toBeCalledWith(
      process.cwd(),
      "node",
      [ "file.js" ],
      expect.any(Function),
      expect.any(Function),
      true
    );
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