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
    files: ["src/**/*.ts", "mocks/**/*.ts"],
  },
  {
    ...typescriptConfig,
    files: ["test/component/**/*.ts"],
    settings: {
      ...typescriptConfig.settings,
      "import/resolver": {
        ...typescriptConfig.settings["import/resolver"],
        alias: {
          map: [
            ["@src", componentPath("src")],
            ["@support", componentPath("test", "component", "support")],
          ],
          extensions: [".ts", ".js", ".jsx", ".json"],
        },
      },
    },
  },
  {
    ...typescriptConfig,
    files: ["test/unit/**/*.ts"],
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
    ...typescriptConfig,
    files: ["test/e2e/**/*.ts"],
    settings: {
      ...typescriptConfig.settings,
      "import/resolver": {
        ...typescriptConfig.settings["import/resolver"],
      },
    },
  },
  {
    ...jestConfig,
    files: [
      ...jestConfig.files,
      "test/unit/support/**/*.ts",
      "test/component/support/**/*.ts",
      "test/e2e/**/*.ts",
    ],
  },
  {
    files: [
      "test/component/**/*.spec.ts",
      "test/component/**/*.test.ts",
      "test/unit/**/*.spec.ts",
      "test/unit/**/*.test.ts",
    ],
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
    ignores: ["test/**/fixtures/**/*.*"],
  },
];
