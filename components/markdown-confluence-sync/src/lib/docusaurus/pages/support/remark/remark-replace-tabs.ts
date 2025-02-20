// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import type { Content, Root } from "mdast";
import type {
  MdxJsxAttribute,
  MdxJsxExpressionAttribute,
  MdxJsxFlowElement,
} from "mdast-util-mdx-jsx";
import type { Plugin as UnifiedPlugin } from "unified";

import { replace } from "../../../../../lib/support/unist/unist-util-replace.js";
import { InvalidTabItemMissingLabelError } from "../../errors/InvalidTabItemMissingLabelError.js";
import { InvalidTabsFormatError } from "../../errors/InvalidTabsFormatError.js";

const mdxElement = "mdxJsxFlowElement";
/**
 * UnifiedPlugin to replace \<Tabs\> elements from tree.
 *
 * @throws {InvalidTabsFormatError} if \<Tabs\> tag does not have only TabItem children.
 * @throws {InvalidTabItemMissingLabelError} if \<TabItem\> tag does not have a label property.
 * @see {@link https://docusaurus.io/docs/markdown-features/tabs | Docusaurus Details}
 */
const remarkReplaceTabs: UnifiedPlugin<
  Array<void>,
  Root
> = function remarkReplaceTabs() {
  return function (tree) {
    replace(tree, mdxElement, replaceTabsTag);
  };
};

function replaceTabsTag(node: MdxJsxFlowElement) {
  if (node.name !== "Tabs") {
    return node;
  }
  const tabsSections = [...node.children] as MdxJsxFlowElement[];
  if (
    !tabsSections.every(
      (child) => child.type === mdxElement && child.name === "TabItem",
    )
  ) {
    throw new InvalidTabsFormatError();
  }
  if (
    !tabsSections.every((tabItem) =>
      tabItem.attributes.find(checkLabelAttribute),
    )
  ) {
    throw new InvalidTabItemMissingLabelError();
  }
  return {
    type: "list",
    ordered: false,
    children: tabsSections.map((tabItem) => processTabItem(tabItem)).flat(),
  };
}

function processTabItem(tabItem: MdxJsxFlowElement) {
  return {
    type: "listItem",
    children: [
      {
        type: "text",
        value: `${tabItem.attributes.find(checkLabelAttribute)?.value}`,
      },
      ...processChildren(tabItem.children as Content[]),
    ],
  };
}

const checkLabelAttribute = (
  attr: MdxJsxAttribute | MdxJsxExpressionAttribute,
) => attr.type === "mdxJsxAttribute" && attr.name === "label";

function processChildren(children: Content[]): Content[] {
  return children.map((child) =>
    child.type === mdxElement
      ? (replaceTabsTag(child as MdxJsxFlowElement) as Content)
      : child,
  );
}

export default remarkReplaceTabs;
