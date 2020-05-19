import path from "path";

export const constants = {
  tsNode: path.join(process.cwd(), "node_modules", ".bin", "ts-node"),
  node: "node",
  envVarKey: "env:",
}