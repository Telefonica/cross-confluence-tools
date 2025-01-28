// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import { relative } from "node:path";

import type { LoggerInterface } from "@mocks-server/logger";
import { glob } from "glob";

import type {
  FilesMetadata,
  FilesPattern,
} from "../MarkdownConfluenceSync.types.js";
import { isStringWithLength } from "../support/typesValidations.js";

import type {
  MarkdownFlatDocumentsConstructor,
  MarkdownFlatDocumentsOptions,
} from "./DocusaurusFlatPages.types.js";
import type {
  MarkdownDocument,
  MarkdownDocumentsInterface,
} from "./DocusaurusPages.types.js";
import { MarkdownDocFactory } from "./pages/DocusaurusDocPageFactory.js";
import { SyncModes } from "@tid-xcut/confluence-sync";

export const MarkdownFlatDocuments: MarkdownFlatDocumentsConstructor = class MarkdownFlatDocuments
  implements MarkdownDocumentsInterface
{
  private _path: string;
  private _logger: LoggerInterface;
  private _initialized = false;
  private _filesPattern: FilesPattern;
  private _filesMetadata?: FilesMetadata;
  private _mode: SyncModes.FLAT | SyncModes.ID;

  constructor({
    logger,
    filesPattern,
    filesMetadata,
    cwd,
    mode,
  }: MarkdownFlatDocumentsOptions) {
    this._mode = mode;
    this._path = cwd;
    this._filesPattern = filesPattern as FilesPattern;
    this._filesMetadata = filesMetadata;
    this._logger = logger.namespace("doc-flat");
  }

  public async read(): Promise<MarkdownDocument[]> {
    await this._init();
    const filesPaths = await this._obtainedFilesPaths();
    this._logger.debug(
      `Found ${filesPaths.length} files in ${this._path} matching the pattern '${this._filesPattern}'`,
    );
    return await this._transformFilePathsToMarkdownDocuments(filesPaths);
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

  private async _transformFilePathsToMarkdownDocuments(
    filesPaths: string[],
  ): Promise<MarkdownDocument[]> {
    const files = filesPaths.map((filePath) =>
      MarkdownDocFactory.fromPath(filePath, {
        logger: this._logger,
        filesMetadata: this._filesMetadata,
      }),
    );
    const pages = files.map<MarkdownDocument>((item) => ({
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
        throw new Error(`File pattern can't be empty in ${this._mode} mode`);
      }
      this._filesPattern = this._filesPattern as FilesPattern;
      this._initialized = true;
    }
  }
};
