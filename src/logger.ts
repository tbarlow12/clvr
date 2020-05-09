import chalk from "chalk";

export class Logger {

  public static log(message: string, ...args: any[]) {
    console.log(chalk.cyan(message, args));
  }

  public static green(message: string, ...args: any[]) {
    console.log(chalk.greenBright(message, args));
  }

  public static warn(message: string, ...args: any[]) {
    console.warn(chalk.yellow(message, args));
  }

  public static error(message: string, ...args: any[]) {
    console.error(chalk.red(message, args));
  }
}