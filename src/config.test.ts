import { getConfig } from "./config"


describe("Config", () => {
  it("gets default config", () => {
    const config = getConfig();
    expect(config.directories).toBeUndefined();
    expect(config.tests).toEqual("**/*.clvr.(ts|js)");
    expect(config.runAsync).toBe(false);
  });

  it("gets provided config", () => {
    const config = getConfig("test/clvr.config.json");
    expect(config.directories).toEqual("dir*/");
    expect(config.tests).toEqual("**/*.clvr.ts");
    expect(config.runAsync).toBe(false);
  }); 
});