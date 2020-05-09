import * as CloverIndex from "./"

describe("Index", () => {
  it("contains exported items", () => {
    const {
      Summarizers,
      run
    } = CloverIndex
    expect(Summarizers).toBeDefined();
    expect(run).toBeDefined();
  });
});