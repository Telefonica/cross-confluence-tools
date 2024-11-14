import type { ConfigInterface } from "@mocks-server/config";
import { Config } from "@mocks-server/config";
import type { LoggerInterface } from "@mocks-server/logger";
import { Logger } from "@mocks-server/logger";
import { SyncModes } from "@telefonica-cross/confluence-sync";

import { ConfluenceSync } from "./confluence/ConfluenceSync.js";
import type {
  ConfluenceSyncInterface,
  ConfluenceSyncPage,
} from "./confluence/ConfluenceSync.types.js";
import { DocusaurusPages } from "./docusaurus/DocusaurusPages.js";
import type {
  DocusaurusPage,
  DocusaurusPagesInterface,
} from "./docusaurus/DocusaurusPages.types.js";
import type {
  DocusaurusToConfluenceConstructor,
  DocusaurusToConfluenceInterface,
  Configuration,
  LogLevelOption,
  LogLevelOptionDefinition,
  ModeOptionDefinition,
  FilesPatternOptionDefinition,
  ModeOption,
  FilesPatternOption,
} from "./DocusaurusToConfluence.types.js";

const MODULE_NAME = "markdown-confluence-sync";
const DOCUSAURUS_NAMESPACE = "docusaurus";
// eslint-disable-next-line
const CONFLUENCE_NAMESPACE = "confluence"

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

export const DocusaurusToConfluence: DocusaurusToConfluenceConstructor = class DocusaurusToConfluence
  implements DocusaurusToConfluenceInterface
{
  private _docusaurusPages: DocusaurusPagesInterface;
  private _confluenceSync: ConfluenceSyncInterface;
  private _configuration: ConfigInterface;
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

    const docusaurusLogger = this._logger.namespace(DOCUSAURUS_NAMESPACE);

    const confluenceConfig =
      this._configuration.addNamespace(CONFLUENCE_NAMESPACE);
    const confluenceLogger = this._logger.namespace(CONFLUENCE_NAMESPACE);

    this._docusaurusPages = new DocusaurusPages({
      config: this._configuration,
      logger: docusaurusLogger,
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
    const pages = await this._docusaurusPages.read();
    await this._confluenceSync.sync(
      this._docusaurusPagesToConfluencePages(pages),
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

  private _docusaurusPagesToConfluencePages(
    docusaurusPages: DocusaurusPage[],
  ): ConfluenceSyncPage[] {
    this._logger.info(
      `Converting ${docusaurusPages.length} Docusaurus pages to Confluence pages...`,
    );
    return docusaurusPages;
  }
};
