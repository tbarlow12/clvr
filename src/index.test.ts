import clvr from "./";
import { run } from "./clover"

describe("Index", () => {
  it("contains exported items", () => {
    expect(clvr).toEqual(run);
  });
});