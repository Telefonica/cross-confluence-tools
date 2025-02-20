// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import type { DocusaurusDocPageFactoryInterface } from "../pages/DocusaurusDocPageFactory.types.js";

import type { DocusaurusDocItemFactoryFromPathOptions } from "./DocusaurusDocItemFactory.types.js";
import type { DocusaurusDocTreeItem } from "./DocusaurusDocTree.types.js";

/**
 * Factory for creating DocusaurusDocTreeItem instances from docusaurus pages.
 *
 *
 * @export DocusaurusDocTreePageFactory
 * @extends DocusaurusDocPageFactoryInterface
 */
export interface DocusaurusDocTreePageFactoryInterface
  extends DocusaurusDocPageFactoryInterface {
  /**
   * Creates a new page from the category index.
   *
   * If the path is an mdx file, the {@link DocusaurusDocTreePageMdx} will be parsed with mdx instructions.
   * Otherwise, the {@link DocusaurusDocTreePage} will be the parser with md instructions.
   *
   * @param path - The path to create the page.
   *
   * @returns A new DocusaurusDocTreeItem instance.
   */
  fromCategoryIndex(
    path: string,
    options?: DocusaurusDocItemFactoryFromPathOptions,
  ): DocusaurusDocTreeItem;
}
