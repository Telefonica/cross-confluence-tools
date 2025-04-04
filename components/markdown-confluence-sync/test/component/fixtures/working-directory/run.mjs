#!/usr/bin/env node

// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import { MarkdownConfluenceSync } from "../../../../dist/index.js";

const markdownToConfluence = new MarkdownConfluenceSync({
  cwd: "./subfolder",
  config: {
    readArguments: false,
    readEnvironment: true,
    readFile: true,
  },
});
await markdownToConfluence.sync();
