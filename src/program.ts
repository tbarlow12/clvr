import commander from "commander";
const packageJson = require("../package.json");

export const program = commander
  .version(packageJson.version)
  .description("This is my CLI")
  .option("-c, --config <value>", "Configuration file")
  .option("-t, --tests <value>", "Pattern for test file(s)")
  .option("-d --directories <value>", "Pattern for test directories")
  .parse(process.argv);