import type { Blockquote, Content, Paragraph, Root } from "mdast";
import type { Plugin as UnifiedPlugin } from "unified";
import find from "unist-util-find";

import { replace } from "../../../../../lib/support/unist/unist-util-replace.js";

// FIXME: eslint false positive
//  https://github.com/typescript-eslint/typescript-eslint/issues/325

enum DocusaurusAdmonitionType {
  Note = "note",
  Tip = "tip",
  Info = "info",
  Caution = "caution",
  Danger = "danger",
}

const admonitionMessage: Record<DocusaurusAdmonitionType, string> = {
  [DocusaurusAdmonitionType.Note]: "Note",
  [DocusaurusAdmonitionType.Tip]: "Tip",
  [DocusaurusAdmonitionType.Info]: "Info",
  [DocusaurusAdmonitionType.Caution]: "Caution",
  [DocusaurusAdmonitionType.Danger]: "Danger",
};

function composeTitle(type: string, title: Paragraph | undefined): Paragraph {
  const typeNode = {
    type: "text" as const,
    value: `${admonitionMessage[type as DocusaurusAdmonitionType]}:`,
  };
  const children = title?.children ?? [];
  return {
    type: "paragraph" as const,
    children: [
      {
        type: "strong" as const,
        children:
          children.length === 0
            ? [typeNode]
            : [typeNode, { type: "text", value: " " }, ...children],
      },
    ],
  };
}

/**
 * UnifiedPlugin to replace Docusaurus' Admonitions with block-quotes from tree.
 *
 * @throws {Error} if the admonitions is not well constructed.
 *
 * @see {@link https://docusaurus.io/docs/markdown-features/admonitions | Docusaurus Admonitions}
 */
const remarkRemoveAdmonitions: UnifiedPlugin<
  Array<void>,
  Root
> = function remarkRemoveAdmonitions() {
  return function (tree) {
    replace(tree, "containerDirective", (node): Blockquote => {
      const admonitionTitle = find(
        node,
        (child: Content) =>
          child.type === "paragraph" && child.data?.directiveLabel,
      ) as Paragraph | undefined;
      if (admonitionTitle !== undefined) {
        node.children.splice(node.children.indexOf(admonitionTitle), 1);
      }
      return {
        type: "blockquote" as const,
        children: [composeTitle(node.name, admonitionTitle), ...node.children],
      };
    });
  };
};

export default remarkRemoveAdmonitions;
