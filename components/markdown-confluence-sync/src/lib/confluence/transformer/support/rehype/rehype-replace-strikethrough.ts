import type { Root } from "hast";
import type { Plugin as UnifiedPlugin } from "unified";

import { replace } from "../../../../support/unist/unist-util-replace.js";

/**
 * UnifiedPlugin to replace `<del>` HastElements with a `<span>`
 * tag with the `text-decoration: line-through;` style.
 *
 * @see {@link https://developer.atlassian.com/server/confluence/confluence-storage-format/ | Confluence Storage Format }
 *
 * @example
 *  <del>Deleted text</del>
 *  // becomes
 *  <span style="text-decoration: line-through;">Deleted text</span>
 */
const rehypeReplaceStrikethrough: UnifiedPlugin<[], Root> =
  function rehypeReplaceStrikethrough() {
    return function transformer(tree) {
      replace(tree, { type: "element", tagName: "del" }, (node) => {
        return {
          type: "element" as const,
          tagName: "span",
          properties: {
            style: "text-decoration: line-through;",
          },
          children: node.children,
        };
      });
    };
  };

export default rehypeReplaceStrikethrough;
