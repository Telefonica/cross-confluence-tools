import type { Element as HastElement, ElementContent, Root } from "hast";
import type { Plugin as UnifiedPlugin } from "unified";
import find from "unist-util-find";
import { remove } from "unist-util-remove";

import { replace } from "../../../../support/unist/unist-util-replace.js";

/**
 * UnifiedPlugin to replace task lists in Confluence Storage Format
 *
 * @see {@link https://developer.atlassian.com/server/confluence/confluence-storage-format/ | Confluence Storage Format }
 */
const rehypeReplaceTaskList: UnifiedPlugin<[], Root> =
  function rehypeReplaceTaskList() {
    return function (tree: Root) {
      replace(tree, "element", replaceTaskList);
    };
  };

function replaceTaskList(node: HastElement) {
  if (node.tagName !== "ul") return node;
  if (!(node.properties?.className as string[])?.includes("contains-task-list"))
    return node;
  return {
    type: "element" as const,
    tagName: "ac:task-list",
    children: node.children.map((child) =>
      child.type !== "element"
        ? child
        : {
            type: "element" as const,
            tagName: "ac:task",
            children: [
              {
                type: "element" as const,
                tagName: "ac:task-status",
                children: [
                  {
                    type: "text" as const,
                    value: find(child, { type: "element", tagName: "input" })
                      ?.properties.checked
                      ? "complete"
                      : "incomplete",
                  },
                ],
              },
              {
                type: "element" as const,
                tagName: "ac:task-body",
                children: processChildren(
                  remove(
                    child,
                    find(child, { type: "element", tagName: "input" }),
                  ),
                ),
              },
            ],
          },
    ),
  };
}

function processChildren(node: HastElement | null): ElementContent[] {
  if (!node?.children) return [];
  const childrenToProcess = node.children as HastElement[];
  return childrenToProcess.map(replaceTaskList);
}
export default rehypeReplaceTaskList;
