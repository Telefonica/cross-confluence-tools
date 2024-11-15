// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: MIT

import path from "path";

import {
  defaultConfigWithoutTypescript,
  typescriptConfig,
  jestConfig,
} from "../eslint-config/index.js";

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
          map: [["@src", componentPath("src")]],
          extensions: [".ts", ".js", ".jsx", ".json"],
        },
      },
    },
  },
  jestConfig,
];
