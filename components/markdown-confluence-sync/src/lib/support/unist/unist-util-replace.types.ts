// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import type { Data, Node as UnistNode, Parent } from "unist";
import type { Test } from "unist-util-is";
import type { ParentsOf } from "unist-util-visit/lib/index.js";
import type {
  InclusiveDescendant,
  Matches,
} from "unist-util-visit-parents/complex-types.js";

/**
 * @module "unist-util-replace"
 * Types module based on unist-util-visit types
 *
 * @see {@link https://github.com/syntax-tree/unist-util-visit/blob/main/lib/index.js | unist-util-visit - types}
 */

/**
 * Handle a node (matching `test`, if given).
 *
 * Visitors are free to transform `node`.
 * They can also transform `parent`.
 *
 * Replacing `node` itself, if `SKIP` is not returned, still causes its
 * descendants to be walked (which is a bug).
 *
 * When adding or removing previous siblings of `node` (or next siblings, in
 * case of reverse), the `Visitor` should return a new `Index` to specify the
 * sibling to traverse after `node` is traversed.
 * Adding or removing next siblings of `node` (or previous siblings, in case
 * of reverse) is handled as expected without needing to return a new `Index`.
 *
 * Removing the children property of `parent` still results in them being
 * traversed.
 */
export type Replacer<
  Visited extends UnistNode<Data> = UnistNode<Data>,
  Ancestor extends Parent<UnistNode<Data>, Data> = Parent<
    UnistNode<Data>,
    Data
  >,
  ReplacerResult = Ancestor["children"][0],
> = (
  node: Visited,
  index: Visited extends UnistNode ? number | null : never,
  parent: Ancestor extends UnistNode ? Ancestor | null : never,
) => ReplacerResult;

/**
 * Build a typed `Visitor` function from a node and all possible parents.
 *
 * It will infer which values are passed as `node` and which as `parent`.
 */
export type BuildReplacerFromMatch<
  Visited extends UnistNode<Data>,
  Ancestor extends Parent<UnistNode<Data>, Data>,
> = Replacer<Visited, ParentsOf<Ancestor, Visited>>;

/**
 * Build a typed `Visitor` function from a list of descendants and a test.
 *
 * It will infer which values are passed as `node` and which as `parent`.
 */
export type BuildReplacerFromDescendants<
  Descendant extends UnistNode<Data>,
  Check extends Test,
> = BuildReplacerFromMatch<
  Matches<Descendant, Check>,
  Extract<Descendant, Parent>
>;

/**
 * Build a typed `Visitor` function from a tree and a test.
 *
 * It will infer which values are passed as `node` and which as `parent`.
 */
export type BuildReplacer<
  Tree extends UnistNode<Data> = UnistNode<Data>,
  Check extends Test = string,
> = BuildReplacerFromDescendants<InclusiveDescendant<Tree>, Check>;
