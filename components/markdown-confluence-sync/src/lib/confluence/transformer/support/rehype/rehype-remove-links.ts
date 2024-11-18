// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import type { Element as HastElement, Node as HastNode, Root } from "hast";
import type { Plugin as UnifiedPlugin } from "unified";
import { remove } from "unist-util-remove";

import { replace } from "../../../../support/unist/unist-util-replace.js";

import type { RehypeRemoveLinksOptions } from "./rehype-remove-links.types.js";

function isLink(node: HastNode): node is HastElement {
  return (node as HastElement).tagName === "a";
}

function isExternalLink(node: HastNode): node is HastElement {
  return (
    isLink(node) &&
    (node.properties?.href?.toString().startsWith("http") ?? false)
  );
}

function isInternalLink(node: HastNode): node is HastElement {
  return (
    isLink(node) && (node.properties?.href?.toString().startsWith(".") ?? false)
  );
}

function isImage(node: HastNode): node is HastElement {
  return (node as HastElement).tagName === "img";
}

// FIXME: remove this plugin
/**
 * UnifiedPlugin to remove links in html
 *
 * @deprecated Not required anymore
 */
const rehypeRemoveLinks: UnifiedPlugin<[RehypeRemoveLinksOptions], Root> =
  function rehypeRemoveLinks(options) {
    return function (tree) {
      if (options.anchors !== false) {
        if (options.anchors === true || options.anchors?.external === true) {
          replace(tree, isExternalLink, (node) => {
            return {
              type: "element" as const,
              tagName: "span",
              children: node.children,
            };
          });
        }
        if (options.anchors === true || options.anchors?.internal === true) {
          replace(tree, isInternalLink, (node) => {
            return {
              type: "element" as const,
              tagName: "span",
              children: node.children,
            };
          });
        }
      }
      if (options.images === true) {
        remove(tree, { cascade: true }, isImage);
      }
    };
  };

export default rehypeRemoveLinks;
