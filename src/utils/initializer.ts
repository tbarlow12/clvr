import { ResultSet } from "../models/results";
import { CommandValidation } from "../models/validation";
import { Utils } from "./utils";

export class Initializer {
  public static resultSet(directories: string[], validations: CommandValidation[]): ResultSet {
    const results: ResultSet = {};
    for (const d of directories) {
      const dirName = Utils.getDirName(d);
      for (const v of validations) {
        if (!(dirName in results)) {
          results[dirName] = {}
        }
        results[dirName][v.command] = {
          passed: false,
          run: false,
          directory: dirName,
          command: v.command,
        }
      }
    }
    return results;
  }
}