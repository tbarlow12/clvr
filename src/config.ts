import path from "path";
import fs from "fs";

export interface CloverConfig {
  directories?: string;
  tests?: string;
  runAsync?: boolean;
}

const defaultConfig: CloverConfig = {
  tests: "**/*.clvr.(ts|js)",
  runAsync: false,
}

export function getConfig(configPath?: string): CloverConfig {
  const fullConfigPath = (path.join(process.cwd(), configPath || "clvr.config.json"));
  if (fs.existsSync(fullConfigPath)) {
    const config: CloverConfig = require(fullConfigPath);
    return {
      ...defaultConfig,
      ...config
    };
  }
  return defaultConfig;  
}