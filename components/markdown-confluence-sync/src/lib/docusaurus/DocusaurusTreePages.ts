// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import { join, basename, dirname, relative, sep } from "node:path";

import type { LoggerInterface } from "@mocks-server/logger";

import type {
  MarkdownDocument,
  MarkdownDocumentsInterface,
} from "./DocusaurusPages.types.js";
import type {
  DocusaurusTreePagesConstructor,
  DocusaurusTreePagesOptions,
} from "./DocusaurusTreePages.types.js";
import { DocusaurusDocTree } from "./tree/DocusaurusDocTree.js";
import type { DocusaurusDocTreeInterface } from "./tree/DocusaurusDocTree.types.js";
import { buildIndexFileRegExp, getIndexFileFromPaths } from "./util/files.js";

export const DocusaurusTreePages: DocusaurusTreePagesConstructor = class DocusaurusTreePages
  implements MarkdownDocumentsInterface
{
  private _path: string;
  private _tree: DocusaurusDocTreeInterface;
  private _logger: LoggerInterface;

  constructor({ logger, path }: DocusaurusTreePagesOptions) {
    this._path = path as string;
    this._logger = logger;
    this._tree = new DocusaurusDocTree(this._path, {
      logger: this._logger.namespace("doc-tree"),
    });
  }

  public async read(): Promise<MarkdownDocument[]> {
    const items = await this._tree.flatten();
    const pages = items.map<MarkdownDocument>((item) => ({
      title: item.meta.confluenceTitle || item.meta.title,
      path: item.path,
      relativePath: relative(this._path, item.path),
      content: item.content,
      ancestors: [],
      name: item.meta.confluenceShortName,
    }));
    this._logger.debug(`Found ${pages.length} pages in ${this._path}`);
    const pagePaths = pages.map(({ path }) => path);
    return pages.map((page) => ({
      ...page,
      ancestors: this._getItemAncestors(page, pagePaths),
    }));
  }

  private _getItemAncestors(
    page: MarkdownDocument,
    paths: string[],
  ): MarkdownDocument["ancestors"] {
    // HACK: Added filter to removed empty string because windows separator
    // add double slash and this cause empty string in the end of array
    const dirnamePath = basename(dirname(page.path));
    const idSegments = relative(this._path, page.path)
      .replace(buildIndexFileRegExp(sep, dirnamePath), "")
      .split(sep)
      .filter((value) => value !== "");
    if (idSegments.length === 1) return [];
    return idSegments
      .slice(0, -1)
      .map((_idSegment, index) =>
        getIndexFileFromPaths(
          join(this._path, ...idSegments.slice(0, index + 1)),
          paths,
        ),
      );
  }
};
