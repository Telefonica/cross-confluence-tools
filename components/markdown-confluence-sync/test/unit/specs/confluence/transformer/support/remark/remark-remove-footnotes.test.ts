// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import { remark } from "remark";
import remarkGfm from "remark-gfm";
import { dedent } from "ts-dedent";

import remarkRemoveFootnotes from "@src/lib/confluence/transformer/support/remark/remark-remove-footnotes";

describe("remark-remove-footnotes", () => {
  it("should be defined", () => {
    expect(remarkRemoveFootnotes).toBeDefined();
  });

  it("should remove footnotes", () => {
    // Arrange
    const input = dedent`
    This is a paragraph with a footnote[^1].

    [^1]: This is a footnote.
    `;

    // Act
    const actual = remark()
      .use(remarkGfm)
      .use(remarkRemoveFootnotes)
      .processSync(input)
      .toString();

    // Assert
    expect(actual).toContain(`This is a paragraph with a footnote.`);
    expect(actual).not.toContain(`[^1]: This is a footnote.`);
  });
});
