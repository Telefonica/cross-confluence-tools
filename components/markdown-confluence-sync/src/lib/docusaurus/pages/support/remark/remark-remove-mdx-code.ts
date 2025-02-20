// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import type { Root } from "mdast";
import type { Plugin as UnifiedPlugin } from "unified";
import { remove } from "unist-util-remove";

const removedMdxTypes = [
  "mdxJsxFlowElement",
  "mdxTextExpression",
  "mdxJsxTextElement",
  "mdxJsxAttribute",
  "mdxJsxExpressionAttribute",
  "mdxJsxAttributeValueExpression",
  "mdxJsEsm",
  "mdxFlowExpression",
];

/**
 * UnifiedPlugin to remove mdx code from the AST.
 *
 * @see {@link https://github.com/syntax-tree/mdast-util-mdx-expression#syntax-tree}
 * @see {@link https://github.com/syntax-tree/mdast-util-mdx-jsx#syntax-tree}
 * @see {@link https://github.com/syntax-tree/mdast-util-mdxjs-esm#syntax-tree}
 */
const remarkRemoveMdxCode: UnifiedPlugin<
  Array<void>,
  Root
> = function remarkRemoveMdxCode() {
  return function (tree) {
    remove(tree, removedMdxTypes);
  };
};

export default remarkRemoveMdxCode;
