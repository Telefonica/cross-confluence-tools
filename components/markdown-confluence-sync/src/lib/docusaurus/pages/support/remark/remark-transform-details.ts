import type { Root } from "mdast";
import { mdxToMarkdown } from "mdast-util-mdx";
import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import { toMarkdown } from "mdast-util-to-markdown";
import type { Plugin as UnifiedPlugin } from "unified";

import { replace } from "../../../../support/unist/unist-util-replace.js";

const mdxElement = "mdxJsxFlowElement";
/**
 * UnifiedPlugin to prevent \<Details\> elements from being removed from the tree.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details}
 */
const remarkTransformDetails: UnifiedPlugin<
  Array<void>,
  Root
> = function remarkTransformDetails() {
  return function (tree) {
    replace(tree, mdxElement, transformDetailsTag);
  };
};

function transformDetailsTag(node: MdxJsxFlowElement) {
  if (node.name !== "details") {
    return node;
  }
  return {
    type: "html",
    value: toMarkdown(node, {
      extensions: [mdxToMarkdown()],
    }),
  };
}

export default remarkTransformDetails;
