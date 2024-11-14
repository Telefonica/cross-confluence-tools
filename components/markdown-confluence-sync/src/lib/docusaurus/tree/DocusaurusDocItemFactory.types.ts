import type { LoggerInterface } from "@mocks-server/logger";

import type { DocusaurusDocTreeItem } from "./DocusaurusDocTree.types.js";

export interface DocusaurusDocItemFactoryFromPathOptions {
  /** Logger */
  logger?: LoggerInterface;
}

/**
 * Factory for creating DocusaurusDocTreeItem instances.
 *
 * @export DocusaurusDocItemFactory
 */
export interface DocusaurusDocItemFactoryInterface {
  /**
   * Creates a new DocusaurusDocTreeItem instance from the given path.
   *
   * If the path is a file, the {@link DocusaurusDocTreeCategory} will be a leaf node.
   * Otherwise, the {@link DocusaurusDocTreePage} will be a parent node.
   *
   * @param path - The path to create the DocusaurusDocTreeItem from.
   *
   * @returns A new DocusaurusDocTreeItem instance.
   */
  fromPath(
    path: string,
    options?: DocusaurusDocItemFactoryFromPathOptions,
  ): DocusaurusDocTreeItem;
}
