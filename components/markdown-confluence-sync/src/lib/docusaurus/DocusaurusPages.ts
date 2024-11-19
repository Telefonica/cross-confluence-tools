// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import { resolve } from "node:path";

import type { ConfigInterface } from "@mocks-server/config";
import type { LoggerInterface } from "@mocks-server/logger";

import type {
  FilesPattern,
  FilesPatternOption,
  ModeOption,
} from "../MarkdownConfluenceSync.types.js";

import type {
  DocsDirOption,
  DocsDirOptionDefinition,
  DocusaurusPage,
  DocusaurusPagesConstructor,
  DocusaurusPagesInterface,
  DocusaurusPagesOptions,
} from "./DocusaurusPages.types.js";
import { DocusaurusPagesFactory } from "./DocusaurusPagesFactory.js";

const DEFAULT_DOCS_DIR = "docs";

const docsDirOption: DocsDirOptionDefinition = {
  name: "docsDir",
  type: "string",
  default: DEFAULT_DOCS_DIR,
};

export const DocusaurusPages: DocusaurusPagesConstructor = class DocusaurusPages
  implements DocusaurusPagesInterface
{
  private _docsDirOption: DocsDirOption;
  private _modeOption: ModeOption;
  private _initialized = false;
  private _path: string;
  private _pages: DocusaurusPagesInterface;
  private _logger: LoggerInterface;
  private _config: ConfigInterface;
  private _filesPattern?: FilesPatternOption;

  constructor({ config, logger, mode, filesPattern }: DocusaurusPagesOptions) {
    this._docsDirOption = config.addOption(docsDirOption);
    this._modeOption = mode;
    this._filesPattern = filesPattern;
    this._config = config;
    this._logger = logger;
  }

  public async read(): Promise<DocusaurusPage[]> {
    await this._init();
    this._logger.debug(`docsDir option is ${this._docsDirOption.value}`);
    return await this._pages.read();
  }

  private _init() {
    this._logger.debug(`mode option is ${this._modeOption.value}`);
    if (!this._initialized) {
      const path = resolve(process.cwd(), this._docsDirOption.value);
      this._path = path;
      this._pages = DocusaurusPagesFactory.fromMode(this._modeOption.value, {
        config: this._config,
        logger: this._logger,
        path: this._path,
        filesPattern: this._filesPattern?.value as FilesPattern,
      });
      this._initialized = true;
    }
  }
};
