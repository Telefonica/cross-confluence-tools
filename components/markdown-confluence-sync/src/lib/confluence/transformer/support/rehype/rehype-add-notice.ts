// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import type { Element as HastElement, Root } from "hast";
import type { Plugin as UnifiedPlugin } from "unified";

import type { RehypeAddNoticeOptions } from "./rehype-add-notice.types.js";

function composeNotice(message: string): HastElement {
  return {
    type: "element",
    tagName: "p",
    children: [
      {
        type: "element",
        tagName: "strong",
        children: [{ type: "raw", value: message }],
      },
    ],
  };
}

/**
 * UnifiedPlugin to add a notice to the AST.
 */
const rehypeAddNotice: UnifiedPlugin<[RehypeAddNoticeOptions], Root> =
  function rehypeAddNotice(options) {
    return function (tree: Root) {
      tree.children.unshift(composeNotice(options.noticeMessage));
    };
  };

export default rehypeAddNotice;
