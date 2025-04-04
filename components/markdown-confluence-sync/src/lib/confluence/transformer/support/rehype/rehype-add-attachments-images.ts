// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import path from "node:path";

import type { Element as HastElement, Root } from "hast";
import type { Plugin as UnifiedPlugin } from "unified";
import { visit } from "unist-util-visit";

import type { ImagesMetadata } from "./rehype-add-attachments-images.types.js";

function isLocalImage(node: HastElement): boolean {
  return (
    node.tagName.toLowerCase() === "img" &&
    node.properties != null &&
    "src" in node.properties &&
    typeof node.properties.src === "string" &&
    !node.properties.src.startsWith("http")
  );
}

/**
 * Plugin to add attachments images in frontmatter
 */
const rehypeAddAttachmentsImages: UnifiedPlugin<[], Root> =
  function rehypeAddAttachmentsImages() {
    return function (tree, file) {
      const images: ImagesMetadata = {};

      visit(tree, "element", function (node) {
        if (isLocalImage(node)) {
          const base = file.dirname
            ? path.resolve(file.cwd, file.dirname)
            : file.cwd;
          const url = path.resolve(base, node.properties?.src as string);
          const baseName = path.basename(url);
          images[baseName] = url;
          node.properties = { ...node.properties, src: baseName };
        }
      });
      file.data.images = images;
    };
  };

export default rehypeAddAttachmentsImages;
