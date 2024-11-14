import type { Root, Code } from "mdast";
import type { Plugin as UnifiedPlugin } from "unified";
import type { Node as UnistNode } from "unist";
import { remove } from "unist-util-remove";

function isMdxCodeBlock(node: UnistNode): node is Code {
  return (
    (node as Code).type === "code" &&
    (node as Code).lang?.toLowerCase() === "mdx-code-block"
  );
}

/**
 * UnifiedPlugin to remove mdx-code-block from the AST.
 *
 * @see {@link https://github.com/syntax-tree/mdast#code | code}
 */
const remarkRemoveMdxCodeBlocks: UnifiedPlugin<
  Array<void>,
  Root
> = function remarkRemoveMdxCodeBlocks() {
  return function (tree) {
    remove(tree, isMdxCodeBlock);
  };
};

export default remarkRemoveMdxCodeBlocks;
