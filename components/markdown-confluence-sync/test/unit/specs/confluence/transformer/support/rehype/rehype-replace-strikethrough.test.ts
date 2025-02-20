// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";

import rehypeReplaceStrikethrough from "@src/lib/confluence/transformer/support/rehype/rehype-replace-strikethrough";

describe("rehype-replace-strikethrough", () => {
  it("should be defined", () => {
    expect(rehypeReplaceStrikethrough).toBeDefined();
  });

  it('should replace <del> with <span style="text-decoration: line-through;">', () => {
    // Arrange
    const html = "<del>deleted</del>";

    // Act & Assert
    expect(
      unified()
        .use(rehypeParse)
        .use(rehypeStringify)
        .use(rehypeReplaceStrikethrough)
        .processSync(html)
        .toString(),
    ).toContain('<span style="text-decoration: line-through;">deleted</span>');
  });

  it("should do nothing to other tags", () => {
    // Arrange
    const html = "<p>paragraph</p>";

    // Act & Assert
    expect(
      unified()
        .use(rehypeParse)
        .use(rehypeStringify)
        .use(rehypeReplaceStrikethrough)
        .processSync(html)
        .toString(),
    ).toContain("<p>paragraph</p>");
  });
});
