import chalk from "chalk";

const log = console.log;
const warn = console.warn;
const error = console.error;

export class Logger {

  public static log(message: string, ...args: any[]) {
    log(chalk.cyan(message, args));
  }

  public static green(message: string, ...args: any[]) {
    log(chalk.greenBright(message, args));
  }

  public static warn(message: string, ...args: any[]) {
    warn(chalk.yellow(message, args));
  }

  public static error(message: string, ...args: any[]) {
    error(chalk.red(message, args));
  }
}