// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import type {
  Element as HastElement,
  Node as HastNode,
  Root as HastRoot,
  ElementContent,
} from "hast";
import type { Root } from "mdast";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import type { Plugin as UnifiedPlugin } from "unified";
import type { VFile } from "vfile";

import { replace } from "../../../../../lib/support/unist/unist-util-replace.js";
import { InvalidDetailsTagMissingSummaryError } from "../../errors/InvalidDetailsTagMissingSummaryError.js";

/**
 * UnifiedPlugin to replace \<details\> HastElements from tree.
 *
 * @example
 * <details>
 *  <summary>Greetings</summary>
 * <p>Hi</p>
 * </details>
 * // becomes
 * <ac:structured-macro ac:name="expand">
 * <ac:parameter ac:name="title">Greetings</ac:parameter>
 * <ac:rich-text-body><p>Hi</p></ac:rich-text-body>
 * </ac:structured-macro>
 * @throws {InvalidDetailsTagMissingSummaryError} if \<details\> tag does not have a \<summary\> tag
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details}
 */
const rehypeReplaceDetails: UnifiedPlugin<
  Array<void>,
  Root
> = function rehypeReplaceDetails() {
  return function (tree) {
    // FIXME: typescript error inferring the types of replace function <t:CROSS-1484>
    //  Getting Typescript following error when running `check:types:test:unit:
    //    TS2589: Type instantiation is excessively deep and possibly infinite.
    // @ts-expect-error TS2589
    replace(tree, { type: "element", tagName: "details" }, replaceDetailsTag);
  };
};

function replaceDetailsTag(node: HastElement): HastElement {
  const detailTitle = node.children.find(
    (child) => child.type === "element" && child.tagName === "summary",
  ) as HastElement | undefined;
  if (detailTitle === undefined) {
    throw new InvalidDetailsTagMissingSummaryError();
  }
  const childrenCopy = [...node.children];
  childrenCopy.splice(childrenCopy.indexOf(detailTitle), 1);
  const childrenProcessed = processDetailsTagChildren(childrenCopy);

  return {
    type: "element" as const,
    tagName: "ac:structured-macro",
    properties: {
      "ac:name": "expand",
    },
    children: [
      {
        type: "element" as const,
        tagName: "ac:parameter",
        properties: {
          "ac:name": "title",
        },
        children: [...detailTitle.children],
      },
      {
        type: "element" as const,
        tagName: "ac:rich-text-body",
        children: childrenProcessed,
      },
    ],
  };
}

/** Parse a string and return a hast HastElement of type body having as children the parsed content
 * @param file - The file to parse
 * @returns The hast HastElement of type body
 * @example
 * parseStringToElement("<h1>Hello, world!</h1>Bye, world!")
 * // returns
 * {
 *  type: 'element',
 *  tagName: 'body',
 *  properties: {},
 *  children: [
 *   {
 *    type: 'element',
 *    tagName: 'h1',
 *    properties: {},
 *    children: [
 *     {
 *      type: 'text',
 *      value: 'Hello, world!'
 *     }
 *    ]
 *   },
 *   {
 *    type: 'text',
 *    value: 'Bye, world!'
 *   }
 *  ]
 * }
 */
function parseStringToElement(file?: string | VFile): HastElement {
  return (remark().use(rehypeParse).parse(file).children[0] as HastElement)
    .children[1] as HastElement;
}

/** Convert a hast node to a string
 * @param node - The hast node to convert
 * @returns The string representation of the node
 * @example
 * convertHastNodeToString({ type: 'element', tagName: 'h1', properties: {}, children: [{ type: 'text', value: 'Hello, world!'}]})
 * // returns
 * '<h1>Hello, world!</h1>'
 */
function convertHastNodeToString(node: HastNode): string {
  return remark()
    .use(rehypeStringify, {
      allowDangerousHtml: true,
      closeSelfClosing: true,
      tightSelfClosing: true,
    })
    .stringify(node as HastRoot);
}

function processDetailsTagChildren(
  children: ElementContent[],
): ElementContent[] {
  return children
    .map((child) => {
      if (child.type === "element" && child.tagName === "details") {
        return convertHastNodeToString(replaceDetailsTag(child));
      }
      if (child.type === "text") {
        return remark()
          .use(remarkRehype)
          .use(rehypeStringify, {
            allowDangerousHtml: true,
            closeSelfClosing: true,
            tightSelfClosing: true,
          })
          .processSync(child.value);
      }
      return convertHastNodeToString(child);
    })
    .map(parseStringToElement)
    .map((child) => child.children)
    .flat();
}
export default rehypeReplaceDetails;
