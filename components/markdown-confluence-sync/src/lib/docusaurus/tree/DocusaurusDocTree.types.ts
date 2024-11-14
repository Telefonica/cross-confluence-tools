import type { LoggerInterface } from "@mocks-server/logger";

import type {
  DocusaurusDocPageInterface,
  DocusaurusDocPageMeta,
} from "../pages/DocusaurusDocPage.types";

export interface DocusaurusDocTreeOptions {
  /** Logger */
  logger?: LoggerInterface;
}

/** Creates a DocusaurusDocTree interface */
export interface DocusaurusDocTreeConstructor {
  /** Returns DocusaurusDocTree interface
   * @param {string} path - Path to the docs directory
   * @param {DocusaurusDocTreeOptions} [options] - Options
   * @returns DocusaurusDocTree instance
   * @example const docusaurusDocTree = new DocusaurusDocTree("./docs");
   */
  new (
    path: string,
    options?: DocusaurusDocTreeOptions,
  ): DocusaurusDocTreeInterface;
}

export interface DocusaurusDocTreeInterface {
  /** Returns an array of all Docusaurus tree nodes in prefix order to be synchronize
   * @async
   * @returns {Promise<DocusaurusDocTreeItem>} An array of all Docusaurus tree nodes in prefix order to be synchronize
   * @example
   *  const docusaurusDocTree = new DocusaurusDocTree("./docs");
   *  const tree = await docusaurusDocTree.flatten();
   */
  flatten(): Promise<DocusaurusDocTreeItem[]>;
}

/** Docusaurus Tree Item */
export interface DocusaurusDocTreeItem extends DocusaurusDocPageInterface {
  /**
   * Returns items children.
   *
   * In case of a category, it returns the category children.
   * Otherwise, it returns an array containing itself.
   *
   * @async
   * @returns {Promise<DocusaurusDocTreeItem[]>} An array of DocusaurusDocTreeItem
   * @see {@link DocusaurusDocTreeCategory#visit}
   * @see {@link DocusaurusDocTreePage#visit}
   */
  visit(): Promise<DocusaurusDocTreeItem[]>;
}

/** Docusaurus Tree Item metadata */
export type DocusaurusDocTreeItemMeta = DocusaurusDocPageMeta;
