// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import { relative } from "node:path";

import type { LoggerInterface } from "@mocks-server/logger";
import { glob } from "glob";

import type { FilesPattern } from "../MarkdownConfluenceSync.types.js";
import { isStringWithLength } from "../support/typesValidations.js";

import type {
  DocusaurusFlatPagesConstructor,
  DocusaurusFlatPagesOptions,
} from "./DocusaurusFlatPages.types.js";
import type {
  DocusaurusPage,
  DocusaurusPagesInterface,
} from "./DocusaurusPages.types.js";
import { DocusaurusDocPageFactory } from "./pages/DocusaurusDocPageFactory.js";

export const DocusaurusFlatPages: DocusaurusFlatPagesConstructor = class DocusaurusFlatPages
  implements DocusaurusPagesInterface
{
  private _path: string;
  private _logger: LoggerInterface;
  private _initialized = false;
  private _filesPattern: FilesPattern;

  constructor({ logger, filesPattern }: DocusaurusFlatPagesOptions) {
    this._path = process.cwd();
    this._filesPattern = filesPattern as FilesPattern;
    this._logger = logger.namespace("doc-flat");
  }

  public async read(): Promise<DocusaurusPage[]> {
    await this._init();
    const filesPaths = await this._obtainedFilesPaths();
    this._logger.debug(
      `Found ${filesPaths.length} files in ${this._path} matching the pattern '${this._filesPattern}'`,
    );
    return await this._transformFilePathsToDocusaurusPages(filesPaths);
  }

  private async _obtainedFilesPaths(): Promise<string[]> {
    return await glob(this._filesPattern, {
      cwd: this._path,
      absolute: true,
      ignore: {
        ignored: (p) => !/\.mdx?$/.test(p.name),
      },
    });
  }

  private async _transformFilePathsToDocusaurusPages(
    filesPaths: string[],
  ): Promise<DocusaurusPage[]> {
    const files = filesPaths.map((filePath) =>
      DocusaurusDocPageFactory.fromPath(filePath, { logger: this._logger }),
    );
    const pages = files.map<DocusaurusPage>((item) => ({
      title: item.meta.confluenceTitle || item.meta.title,
      id: item.meta.confluencePageId,
      path: item.path,
      relativePath: relative(this._path, item.path),
      content: item.content,
      ancestors: [],
      name: item.meta.confluenceShortName,
    }));
    this._logger.debug(`Found ${pages.length} pages in ${this._path}`);
    return pages;
  }

  private _init() {
    if (!this._initialized) {
      if (!isStringWithLength(this._filesPattern as string)) {
        throw new Error("File pattern can't be empty in flat mode");
      }
      this._filesPattern = this._filesPattern as FilesPattern;
      this._initialized = true;
    }
  }
};
