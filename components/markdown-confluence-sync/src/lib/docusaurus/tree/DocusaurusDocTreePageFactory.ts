// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import { getIndexFile } from "../util/files.js";

import type { DocusaurusDocItemFactoryFromPathOptions } from "./DocusaurusDocItemFactory.types.js";
import type { DocusaurusDocTreeItem } from "./DocusaurusDocTree.types.js";
import { DocusaurusDocTreePage } from "./DocusaurusDocTreePage.js";
import type { DocusaurusDocTreePageFactoryInterface } from "./DocusaurusDocTreePageFactory.types.js";
import { DocusaurusDocTreePageMdx } from "./DocusaurusDocTreePageMdx.js";
import globule from "globule";
import { relative } from "path";
import { IndexFileIgnoreException } from "../pages/errors/IndexFileIgnoreException.js";

export const DocusaurusDocTreePageFactory: DocusaurusDocTreePageFactoryInterface = class DocusaurusDocTreePageFactory {
  public static fromPath(
    path: string,
    options?: DocusaurusDocItemFactoryFromPathOptions,
  ): DocusaurusDocTreeItem {
    return this._obtainedDocusaurusDocTreePage(path, options);
  }

  public static fromCategoryIndex(
    path: string,
    options: DocusaurusDocItemFactoryFromPathOptions,
  ): DocusaurusDocTreeItem {
    const indexPath = getIndexFile(path, options);
    if (
      options.filesIgnore &&
      globule.isMatch(options.filesIgnore, relative(options.cwd, indexPath))
    ) {
      throw new IndexFileIgnoreException(path);
    }
    return this._obtainedDocusaurusDocTreePage(indexPath, options);
  }

  private static _obtainedDocusaurusDocTreePage(
    path: string,
    options?: DocusaurusDocItemFactoryFromPathOptions,
  ): DocusaurusDocTreeItem {
    if (path.endsWith(".mdx")) {
      return new DocusaurusDocTreePageMdx(path, options);
    }
    return new DocusaurusDocTreePage(path, options);
  }
};
