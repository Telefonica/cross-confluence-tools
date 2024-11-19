// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import type { Data, Node as UnistNode } from "unist";
import type { Test } from "unist-util-is";
import { visit } from "unist-util-visit";

import type { BuildReplacer } from "./unist-util-replace.types.js";

/**
 * Replace nodes in a tree given a test and a replacement function.
 *
 * @param tree - Root node of the tree to visit.
 * @param is - Test to check if a node should be replaced.
 * @param replacement - Function to build the replacement node.
 */
export function replace<Tree extends UnistNode<Data>, Check extends Test>(
  tree: Tree,
  is: Check,
  replacement: BuildReplacer<Tree, Check>,
) {
  visit(tree, is, (node, index, parent) => {
    // NOTE: Coverage ignored because it is unreachable from tests. Defensive programming.
    /* istanbul ignore if  */
    if (index === null || parent === null) {
      throw new SyntaxError("Unexpected null value");
    }
    const newUnistNode = replacement(node, index, parent);
    parent.children.splice(index, 1, newUnistNode);
  });
}
