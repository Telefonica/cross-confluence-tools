// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import { rehype } from "rehype";

import rehypeAddNotice from "@src/lib/confluence/transformer/support/rehype/rehype-add-notice";

describe("rehype-add-notice", () => {
  it("should be defined", () => {
    expect(rehypeAddNotice).toBeDefined();
  });

  it("should add notice to the AST", () => {
    const tree = ``;

    const actualTree = rehype()
      .data("settings", { fragment: true })
      .use(rehypeAddNotice, { noticeMessage: "Notice message" })
      .processSync(tree)
      .toString();

    expect(actualTree).toEqual(
      expect.stringContaining(`<p><strong>Notice message</strong></p>`),
    );
  });
});
