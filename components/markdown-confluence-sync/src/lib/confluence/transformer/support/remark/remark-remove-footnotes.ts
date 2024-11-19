// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import type { Root } from "mdast";
import type { Plugin as UnifiedPlugin } from "unified";
import { remove } from "unist-util-remove";

/**
 * UnifiedPlugin to remove footnotes from the AST.
 *
 * @see {@link https://github.com/syntax-tree/mdast#footnotes | Footnotes}
 * @see {@link https://github.com/syntax-tree/mdast#footnotedefinition | GFM Footnote Definition}
 * @see {@link https://github.com/syntax-tree/mdast#footnotereference | GFM Footnote Reference}
 */
const remarkRemoveFootnotes: UnifiedPlugin<
  Array<void>,
  Root
> = function remarkRemoveFootnotes() {
  return function (tree) {
    remove(tree, "footnoteDefinition");
    remove(tree, "footnoteReference");
  };
};

export default remarkRemoveFootnotes;
