// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import { customMarkdownConfluenceSync } from "@support/mocks/DocusaurusToConfluence";

import { run } from "@src/Cli";

describe("cli", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should export run function", () => {
    expect(run).toBeDefined();
  });

  it("should call DocusaurusToConfluence sync function", async () => {
    customMarkdownConfluenceSync.sync.mockReturnValue(true);
    await run();

    await expect(customMarkdownConfluenceSync.sync).toHaveBeenCalled();
  });
});
