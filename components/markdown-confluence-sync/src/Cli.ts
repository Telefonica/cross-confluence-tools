// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import { MarkdownConfluenceSync } from "./lib/index.js";

export async function run() {
  const markdownToConfluence = new MarkdownConfluenceSync({
    config: {
      readArguments: true,
      readEnvironment: true,
      readFile: true,
    },
  });
  await markdownToConfluence.sync();
}
