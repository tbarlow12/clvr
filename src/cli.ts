#!/usr/bin/env node
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import path from "path";
import program from "commander";

clear();

console.log(
  chalk.greenBright(
    figlet.textSync("clvr-cli", { horizontalLayout: "full" })
  )
);

program
  .version("0.0.1")
  .description("The Command-Line Validator CLI")
  .option("-v, --verbose", "Verbose logging")
  .parse(process.argv);