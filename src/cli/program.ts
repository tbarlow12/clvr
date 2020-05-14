import commander from "commander";
const packageJson = require("../../package.json");

export class Program {
  public static get() {
    return commander
      .version(packageJson.version)
      .description("This is my CLI")
      .option("-c, --config <value>", "Path to configuration file")
      .option("-t, --tests <value>", "Filter for test file(s)")
      .option("-p --parent <value>", "Path to parent of test directories")
      .parse(process.argv);
  } 
}
