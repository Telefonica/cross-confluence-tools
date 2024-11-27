// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import type { ConfigInterface as customMarkdownConfluenceSyncClass } from "@mocks-server/config";
import { Config } from "@mocks-server/config";
import type { LoggerInterface } from "@mocks-server/logger";
import { Logger } from "@mocks-server/logger";
import { SyncModes } from "@tid-xcut/confluence-sync";

import { ConfluenceSync } from "./confluence/ConfluenceSync.js";
import type {
  ConfluenceSyncInterface,
  ConfluenceSyncPage,
} from "./confluence/ConfluenceSync.types.js";
import { MarkdownDocuments } from "./docusaurus/DocusaurusPages.js";
import type {
  MarkdownDocument,
  MarkdownDocumentsInterface,
} from "./docusaurus/DocusaurusPages.types.js";
import type {
  MarkdownConfluenceSyncConstructor,
  MarkdownConfluenceSyncInterface,
  Configuration,
  LogLevelOption,
  LogLevelOptionDefinition,
  ModeOptionDefinition,
  FilesPatternOptionDefinition,
  ModeOption,
  FilesPatternOption,
} from "./MarkdownConfluenceSync.types.js";

const MODULE_NAME = "markdown-confluence-sync";
const MARKDOWN_NAMESPACE = "markdown";
const CONFLUENCE_NAMESPACE = "confluence";

const DEFAULT_CONFIG: Configuration["config"] = {
  readArguments: false,
  readEnvironment: false,
  readFile: false,
};

const logLevelOption: LogLevelOptionDefinition = {
  name: "logLevel",
  type: "string",
  default: "info",
};

const modeOption: ModeOptionDefinition = {
  name: "mode",
  type: "string",
  default: SyncModes.TREE,
};

const filesPatternOption: FilesPatternOptionDefinition = {
  name: "filesPattern",
  type: "string",
};

export const MarkdownConfluenceSync: MarkdownConfluenceSyncConstructor = class MarkdownConfluenceSync
  implements MarkdownConfluenceSyncInterface
{
  private _markdownDocuments: MarkdownDocumentsInterface;
  private _confluenceSync: ConfluenceSyncInterface;
  private _configuration: customMarkdownConfluenceSyncClass;
  private _initialized = false;
  private _config: Configuration;
  private _logger: LoggerInterface;
  private _logLevelOption: LogLevelOption;
  private _modeOption: ModeOption;
  private _filesPatternOption: FilesPatternOption;

  constructor(config: Configuration) {
    this._config = config;
    if (!this._config) {
      throw new Error("Please provide configuration");
    }

    this._configuration = new Config({ moduleName: MODULE_NAME });
    this._logger = new Logger(MODULE_NAME);
    this._logLevelOption = this._configuration.addOption(
      logLevelOption,
    ) as LogLevelOption;
    this._modeOption = this._configuration.addOption(modeOption) as ModeOption;
    this._filesPatternOption = this._configuration.addOption(
      filesPatternOption,
    ) as FilesPatternOption;

    const markdownLogger = this._logger.namespace(MARKDOWN_NAMESPACE);

    const confluenceConfig =
      this._configuration.addNamespace(CONFLUENCE_NAMESPACE);
    const confluenceLogger = this._logger.namespace(CONFLUENCE_NAMESPACE);

    this._markdownDocuments = new MarkdownDocuments({
      config: this._configuration,
      logger: markdownLogger,
      mode: this._modeOption,
      filesPattern: this._filesPatternOption,
    });
    this._confluenceSync = new ConfluenceSync({
      config: confluenceConfig,
      logger: confluenceLogger,
      mode: this._modeOption,
    });
  }

  public async sync(): Promise<void> {
    await this._init();
    const pages = await this._markdownDocuments.read();
    await this._confluenceSync.sync(
      this._markdownPagesToConfluencePages(pages),
    );
  }

  private async _init() {
    if (!this._initialized) {
      await this._configuration.load({
        config: { ...DEFAULT_CONFIG, ...this._config.config },
        ...this._config,
      });
      this._logger.setLevel(this._logLevelOption.value);
      this._initialized = true;
    }
  }

  private _markdownPagesToConfluencePages(
    markdownDocuments: MarkdownDocument[],
  ): ConfluenceSyncPage[] {
    this._logger.info(
      `Converting ${markdownDocuments.length} markdown documents to Confluence pages...`,
    );
    return markdownDocuments;
  }
};
