import clvr from "./";
import { run } from "./runner/clover"

describe("Index", () => {
  it("contains exported items", () => {
    expect(clvr).toEqual(run);
  });
});