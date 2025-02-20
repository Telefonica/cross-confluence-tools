// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import remarkDirective from "remark-directive";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { dedent } from "ts-dedent";
import { unified } from "unified";

import remarkReplaceAdmonitions from "@src/lib/docusaurus/pages/support/remark/remark-replace-admonitions";

describe("remarkReplaceAdmonitions", () => {
  it("should be defined", () => {
    expect(remarkReplaceAdmonitions).toBeDefined();
  });

  it("should remove admonitions in single paragraph", () => {
    // Arrange
    const markdown = `:::note
This is a note
:::`;

    // Act
    const file = unified()
      .use(remarkParse)
      .use(remarkStringify)
      .use(remarkDirective)
      .use(remarkReplaceAdmonitions)
      .processSync(markdown);

    // Assert
    expect(file.toString()).toEqual(
      expect.stringContaining(dedent`> **Note:**
      >
      > This is a note
      `),
    );
  });

  it("should remove admonitions with internal nodes in single paragraph", () => {
    // Arrange
    const markdown = dedent`:::note
    **Hello World**
    :::`;

    // Act
    const file = unified()
      .use(remarkParse)
      .use(remarkStringify)
      .use(remarkDirective)
      .use(remarkReplaceAdmonitions)
      .processSync(markdown);

    // Assert
    expect(file.toString()).toEqual(
      expect.stringContaining(dedent`> **Note:**
      >
      > **Hello World**
      `),
    );
  });

  it("should remove admonitions between multiple paragraphs", () => {
    // Arrange
    const markdown = dedent`:::note
    This is the first part of a note

    This is the second part of a note
    :::`;

    // Act
    const file = unified()
      .use(remarkParse)
      .use(remarkStringify)
      .use(remarkDirective)
      .use(remarkReplaceAdmonitions)
      .processSync(markdown);

    // Assert
    expect(file.toString()).toEqual(
      expect.stringContaining(dedent`> **Note:**
      >
      > This is the first part of a note
      >
      > This is the second part of a note
      `),
    );
  });

  it("should replace endless admonition", () => {
    // Arrange
    const markdown = dedent`:::note
    This is the first part of a note`;

    // Act
    const file = unified()
      .use(remarkParse)
      .use(remarkStringify)
      .use(remarkDirective)
      .use(remarkReplaceAdmonitions)
      .processSync(markdown);

    // Assert
    expect(file.toString()).toEqual(
      expect.stringContaining(dedent`> **Note:**
      >
      > This is the first part of a note
      `),
    );
  });

  it("should replace admonition with title", () => {
    // Arrange
    const markdown = dedent`:::note[Note]
    This is a note with title
    :::`;

    // Act
    const file = unified()
      .use(remarkParse)
      .use(remarkStringify)
      .use(remarkDirective)
      .use(remarkReplaceAdmonitions)
      .processSync(markdown);

    // Assert
    expect(file.toString()).toEqual(
      expect.stringContaining(dedent`> **Note: Note**
      >
      > This is a note with title
      `),
    );
  });

  describe("admonition types", () => {
    it.each([
      ["note", "Note"],
      ["tip", "Tip"],
      ["info", "Info"],
      ["caution", "Caution"],
      ["danger", "Danger"],
    ])("should replace admonition type %s with %s", (type, expected) => {
      // Arrange
      const markdown = dedent`:::${type}
      This is a ${type}
      :::`;

      // Act
      const file = unified()
        .use(remarkParse)
        .use(remarkStringify)
        .use(remarkDirective)
        .use(remarkReplaceAdmonitions)
        .processSync(markdown);

      // Assert
      expect(file.toString()).toEqual(
        expect.stringContaining(dedent`> **${expected}:**
        >
        > This is a ${type}
        `),
      );
    });
  });
});
