// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import { dirname, resolve } from "path";

import type { Element as HastElement, Node as HastNode, Root } from "hast";
import { toString as hastToString } from "hast-util-to-string";
import type { Plugin as UnifiedPlugin } from "unified";

import { replace } from "../../../../support/unist/unist-util-replace.js";

import type { RehypeReplaceInternalReferences } from "./rehype-replace-internal-references.types.js";

function checkAnchors(node: HastNode): node is HastElement {
  return node.type === "element" && (node as HastElement).tagName === "a";
}

function composeChildren(node: HastElement): HastElement[] {
  if (node.children.length === 0) {
    return [];
  }
  const firstChild = {
    type: "element" as const,
    tagName: "span",
    children: node.children,
  };
  return [
    {
      type: "element" as const,
      tagName: "ac:plain-text-link-body",
      children: [
        {
          type: "raw" as const,
          value: `<![CDATA[${hastToString(firstChild)}]]>`,
        },
      ],
    },
  ];
}

/**
 * UnifiedPlugin to replace internal references in Confluence Storage Format
 *
 * @see {@link https://developer.atlassian.com/server/confluence/confluence-storage-format/ | Confluence Storage Format }
 */
const rehypeConfluenceStorage: UnifiedPlugin<
  [RehypeReplaceInternalReferences],
  Root
> = function rehypeConfluenceStorage({ spaceKey, pages, removeMissing }) {
  return function transformer(tree, file) {
    replace(tree, checkAnchors, (node: HastElement) => {
      if (typeof node.properties?.href !== "string") {
        file.message("Internal reference without href", node.position);
        return node;
      }
      // Skip external references
      if (!node.properties.href.startsWith(".")) {
        return node;
      }
      const referencedPagePath = resolve(
        dirname(file.path),
        node.properties.href,
      );
      const referencedPage = pages.get(referencedPagePath);
      if (referencedPage === undefined) {
        file.message("Internal reference to non-existing page", node.position);
        return removeMissing === true
          ? {
              type: "element" as const,
              tagName: "span",
              children: node.children,
            }
          : node;
      }
      const children = composeChildren(node);
      return {
        type: "element" as const,
        tagName: "ac:link",
        children: [
          {
            type: "element" as const,
            tagName: "ri:page",
            properties: {
              "ri:content-title": referencedPage.title,
              "ri:space-key": spaceKey,
            },
            children: [],
          },
          ...children,
        ],
      };
    });
  };
};

export default rehypeConfluenceStorage;
