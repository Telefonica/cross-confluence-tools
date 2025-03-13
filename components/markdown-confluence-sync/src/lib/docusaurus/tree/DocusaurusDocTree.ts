// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import { existsSync, lstatSync } from "fs";
import { readdir } from "fs/promises";
import { join } from "node:path";

import type { LoggerInterface } from "@mocks-server/logger";

import { DocusaurusDocItemFactory } from "./DocusaurusDocItemFactory.js";
import type {
  DocusaurusDocTreeConstructor,
  DocusaurusDocTreeInterface,
  DocusaurusDocTreeItem,
  DocusaurusDocTreeOptions,
} from "./DocusaurusDocTree.types.js";
import {
  ContentPreprocessor,
  FilesMetadata,
} from "../../MarkdownConfluenceSync.types.js";

export const DocusaurusDocTree: DocusaurusDocTreeConstructor = class DocusaurusDocTree
  implements DocusaurusDocTreeInterface
{
  private _path: string;
  private _logger?: LoggerInterface;
  private _filesMetadata?: FilesMetadata;
  private _contentPreprocessor?: ContentPreprocessor;

  constructor(path: string, options?: DocusaurusDocTreeOptions) {
    if (!existsSync(path)) {
      throw new Error(`Path ${path} does not exist`);
    }
    this._path = path;
    this._logger = options?.logger;
    this._filesMetadata = options?.filesMetadata;
    this._contentPreprocessor = options?.contentPreprocessor;
  }

  public async flatten(): Promise<DocusaurusDocTreeItem[]> {
    const rootPaths = await readdir(this._path);
    if (rootPaths.some((path) => path.endsWith("index.md"))) {
      this._logger?.warn("Ignoring index.md file in root directory.");
    }
    const rootDirs = rootPaths
      .map((path) => join(this._path, path))
      .filter(
        (path) =>
          lstatSync(path).isDirectory() ||
          (path.endsWith(".md") && !path.endsWith("index.md")),
      );
    const roots = rootDirs.map((path) =>
      DocusaurusDocItemFactory.fromPath(path, {
        logger: this._logger?.namespace(path.replace(this._path, "")),
        filesMetadata: this._filesMetadata,
        contentPreprocessor: this._contentPreprocessor,
      }),
    );
    const rootsPages = await Promise.all(roots.map((root) => root.visit()));
    return rootsPages.flat();
  }
};
