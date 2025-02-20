// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import { existsSync, lstatSync, readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { basename, join } from "node:path";

import type { LoggerInterface } from "@mocks-server/logger";
import { parse as parseYaml } from "yaml";

import { InvalidPathException } from "../pages/errors/InvalidPathException.js";
import { PathNotExistException } from "../pages/errors/PathNotExistException.js";
import { isValidFile } from "../util/files.js";

import { DocusaurusDocItemFactory } from "./DocusaurusDocItemFactory.js";
import type {
  DocusaurusDocTreeItem,
  DocusaurusDocTreeItemMeta,
} from "./DocusaurusDocTree.types.js";
import type {
  DocusaurusDocTreeCategoryConstructor,
  DocusaurusDocTreeCategoryInterface,
  DocusaurusDocTreeCategoryMeta,
  DocusaurusDocTreeCategoryOptions,
} from "./DocusaurusDocTreeCategory.types.js";
import type { DocusaurusDocTreePageInterface } from "./DocusaurusDocTreePage.types.js";
import { DocusaurusDocTreePageFactory } from "./DocusaurusDocTreePageFactory.js";
import { CategoryItemMetadataValidator } from "./support/validators/CategoryItemMetadata.js";
import { FilesMetadata } from "../../MarkdownConfluenceSync.types.js";

export const DocusaurusDocTreeCategory: DocusaurusDocTreeCategoryConstructor = class DocusaurusDocTreeCategory
  implements DocusaurusDocTreeCategoryInterface
{
  private _path: string;
  private _index: DocusaurusDocTreePageInterface | undefined;
  private _meta: DocusaurusDocTreeCategoryMeta | undefined;
  private _logger: LoggerInterface | undefined;
  private _filesMetadata: FilesMetadata | undefined;

  constructor(path: string, options?: DocusaurusDocTreeCategoryOptions) {
    if (!existsSync(path)) {
      throw new PathNotExistException(`Path ${path} does not exist`);
    }
    if (!lstatSync(path).isDirectory()) {
      throw new InvalidPathException(`Path ${path} is not a directory`);
    }
    try {
      this._index = DocusaurusDocTreePageFactory.fromCategoryIndex(
        path,
        options,
      );
    } catch (e) {
      if (e instanceof PathNotExistException) {
        options?.logger?.warn(e.message);
      } else {
        throw e;
      }
    }
    this._path = path;
    this._meta = DocusaurusDocTreeCategory._processCategoryItemMetadata(path);
    this._logger = options?.logger;
    this._filesMetadata = options?.filesMetadata;
  }

  public get isCategory(): boolean {
    return true;
  }

  public get meta(): DocusaurusDocTreeItemMeta {
    return {
      title:
        this._meta?.title ?? this._index?.meta.title ?? basename(this._path),
      syncToConfluence: this._index?.meta.syncToConfluence ?? true,
      confluenceShortName: this._index?.meta.confluenceShortName,
      confluenceTitle: this._index?.meta.confluenceTitle,
    };
  }

  public get content(): string {
    return this._index?.content ?? "";
  }

  public get path(): string {
    // NOTE: fake index.md path to be able reference following the same logic as for pages
    return this._index?.path ?? join(this._path, "index.md");
  }

  private get containsIndex(): boolean {
    return this._index !== undefined;
  }

  private static _detectCategoryItemFile(path: string): string | null {
    if (existsSync(join(path, "_category_.yml"))) {
      return join(path, "_category_.yml");
    }
    if (existsSync(join(path, "_category_.yaml"))) {
      return join(path, "_category_.yaml");
    }
    if (existsSync(join(path, "_category_.json"))) {
      return join(path, "_category_.json");
    }
    return null;
  }

  private static _processCategoryItemMetadata(
    path: string,
  ): DocusaurusDocTreeCategoryMeta | undefined {
    const categoryItemFile =
      DocusaurusDocTreeCategory._detectCategoryItemFile(path);
    if (categoryItemFile === null) {
      return undefined;
    }
    try {
      const categoryMeta = parseYaml(readFileSync(categoryItemFile).toString());
      const { label } = CategoryItemMetadataValidator.parse(categoryMeta);
      return {
        title: label,
      };
    } catch (e) {
      throw new Error(`Path ${path} has an invalid _category_.yml file`, {
        cause: e,
      });
    }
  }

  public async visit(): Promise<DocusaurusDocTreeItem[]> {
    if (!this.meta.syncToConfluence) {
      this._logger?.debug(
        `Category ${this._path} is not set to sync to Confluence`,
      );
      return [];
    }
    const paths = await readdir(this._path);
    const childrenPaths = paths
      .map((path) => join(this._path, path))
      .filter(this._isDirectoryOrNotIndexFile);
    const childrenItems = await Promise.all(
      childrenPaths.map((path) =>
        DocusaurusDocItemFactory.fromPath(path, {
          logger: this._logger?.namespace(path.replace(this._path, "")),
          filesMetadata: this._filesMetadata,
        }),
      ),
    );
    const flattenedItems = await Promise.all(
      childrenItems.map((root) => root.visit()),
    );
    const items = flattenedItems.flat();
    this._logger?.debug(`Category ${this._path} has ${items.length} children`);
    if (items.length === 0) {
      return this.containsIndex ? [this] : [];
    }
    return [this, ...items];
  }

  private _isDirectoryOrNotIndexFile(path: string): boolean {
    return lstatSync(path).isDirectory() || isValidFile(path);
  }
};
