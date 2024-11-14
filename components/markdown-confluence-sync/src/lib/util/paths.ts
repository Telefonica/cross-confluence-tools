import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const PACKAGE_ROOT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "..",
);

export const DEPENDENCIES_BIN_PATH = resolve(
  PACKAGE_ROOT,
  "node_modules",
  ".bin",
);
