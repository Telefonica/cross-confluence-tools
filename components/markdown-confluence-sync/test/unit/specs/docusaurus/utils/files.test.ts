// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import { buildIndexFileRegExp } from "@src/lib/docusaurus/util/files";

describe("file utility functions", () => {
  it("should export buildIndexFileRegExp function", () => {
    expect(buildIndexFileRegExp).toBeDefined();
  });

  it("should call buildIndexFileRegExp function and response contains windows path separator", async () => {
    const result = buildIndexFileRegExp("\\", "foo");

    expect(result.toString()).toMatch("/\\\\(");
  });

  it("should call buildIndexFileRegExp function and response contains linux path separator", async () => {
    const result = buildIndexFileRegExp("/", "foo");

    expect(result.toString()).toMatch("/\\/(");
  });
});
