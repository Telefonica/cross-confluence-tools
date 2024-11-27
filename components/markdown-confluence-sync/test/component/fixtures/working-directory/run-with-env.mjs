#!/usr/bin/env node

// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import { MarkdownConfluenceSync } from "../../../../dist/index.js";

const markdownToConfluence = new MarkdownConfluenceSync({
  config: {
    readArguments: false,
    readEnvironment: true,
    readFile: true,
  },
});
await markdownToConfluence.sync();
