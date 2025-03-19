// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import { resolve } from "node:path";

import type { ConfigInterface } from "@mocks-server/config";
import type { LoggerInterface } from "@mocks-server/logger";

import type {
  FilesMetadata,
  FilesMetadataOption,
  FilesPattern,
  FilesPatternOption,
  ModeOption,
  ContentPreprocessorOption,
  ContentPreprocessor,
  FilesIgnoreOption,
} from "../MarkdownConfluenceSync.types.js";

import type {
  DocsDirOption,
  DocsDirOptionDefinition,
  MarkdownDocument,
  MarkdownDocumentsConstructor,
  MarkdownDocumentsInterface,
  MarkdownDocumentsOptions,
} from "./DocusaurusPages.types.js";
import { MarkdownDocumentsFactory } from "./DocusaurusPagesFactory.js";

const DEFAULT_DOCS_DIR = "docs";

const docsDirOption: DocsDirOptionDefinition = {
  name: "docsDir",
  type: "string",
  default: DEFAULT_DOCS_DIR,
};

export const MarkdownDocuments: MarkdownDocumentsConstructor = class MarkdownDocuments
  implements MarkdownDocumentsInterface
{
  private _docsDirOption: DocsDirOption;
  private _modeOption: ModeOption;
  private _initialized = false;
  private _path: string;
  private _pages: MarkdownDocumentsInterface;
  private _logger: LoggerInterface;
  private _config: ConfigInterface;
  private _filesPattern?: FilesPatternOption;
  private _filesMetadata?: FilesMetadataOption;
  private _filesIgnore?: FilesIgnoreOption;
  private _contentPreprocessorOption: ContentPreprocessorOption;
  private _contentPreprocessor?: ContentPreprocessor;
  private _cwd: string;

  constructor({
    config,
    logger,
    mode,
    filesPattern,
    filesMetadata,
    filesIgnore,
    contentPreprocessor,
    cwd,
  }: MarkdownDocumentsOptions) {
    this._docsDirOption = config.addOption(docsDirOption);
    this._cwd = cwd;
    this._modeOption = mode;
    this._filesPattern = filesPattern;
    this._filesMetadata = filesMetadata;
    this._filesIgnore = filesIgnore;
    this._contentPreprocessorOption = contentPreprocessor;
    this._config = config;
    this._logger = logger;
  }

  public async read(): Promise<MarkdownDocument[]> {
    await this._init();
    this._logger.debug(`docsDir option is ${this._docsDirOption.value}`);
    return this._pages.read();
  }

  private _init() {
    this._logger.debug(`mode option is ${this._modeOption.value}`);
    if (!this._initialized) {
      const path = resolve(this._cwd, this._docsDirOption.value);
      this._contentPreprocessor = this._contentPreprocessorOption.value;

      const filesMetadata: FilesMetadata = (
        this._filesMetadata?.value || []
      ).map((metadata) => ({
        ...metadata,
        path: resolve(this._cwd, metadata.path),
      }));

      this._path = path;
      this._pages = MarkdownDocumentsFactory.fromMode(this._modeOption.value, {
        contentPreprocessor: this._contentPreprocessor,
        config: this._config,
        logger: this._logger,
        path: this._path,
        filesPattern: this._filesPattern?.value as FilesPattern,
        filesIgnore: this._filesIgnore?.value,
        filesMetadata,
        cwd: this._cwd,
      });
      this._initialized = true;
    }
  }
};
