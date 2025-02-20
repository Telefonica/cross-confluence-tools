// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: MIT

import {
  defaultConfigWithoutTypescript,
  typescriptConfig,
  jestConfig,
} from "../eslint-config/index.js";
import path from "path";

function componentPath() {
  return path.resolve.apply(null, [import.meta.dirname, ...arguments]);
}

export default [
  ...defaultConfigWithoutTypescript,
  {
    ...typescriptConfig,
    settings: {
      ...typescriptConfig.settings,
      "import/resolver": {
        ...typescriptConfig.settings["import/resolver"],
        alias: {
          map: [
            ["@src", componentPath("src")],
            ["@support", componentPath("test", "unit", "support")],
          ],
          extensions: [".ts", ".js", ".jsx", ".json"],
        },
      },
    },
  },
  {
    ...jestConfig,
    files: [...jestConfig.files, "test/unit/support/**/*.ts"],
  },
  {
    files: ["test/component/**/*.spec.ts"],
    rules: {
      "jest/max-expects": [
        "error",
        {
          max: 30,
        },
      ],
    },
  },
  {
    files: ["test/unit/**/*.spec.ts"],
    rules: {
      "jest/max-expects": [
        "error",
        {
          max: 10,
        },
      ],
    },
  },
];
