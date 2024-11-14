import type {
  OptionDefinition,
  OptionInterfaceOfType,
} from "@mocks-server/config";
import type { LogLevel } from "@mocks-server/logger";
import type { SyncModes } from "@telefonica-cross/confluence-sync";

export type FilesPattern = string | string[];

declare global {
  //eslint-disable-next-line @typescript-eslint/no-namespace
  namespace DocusaurusToConfluence {
    interface Config {
      /** Configuration options */
      config?: {
        /** Read configuration from file */
        readFile?: boolean;
        /** Read configuration from arguments */
        readArguments?: boolean;
        /** Read configuration from environment */
        readEnvironment?: boolean;
      };
      /** Log level */
      logLevel?: LogLevel;
      /** Mode to structure pages */
      mode?: SyncModes;
      /**
       * Pattern to search files when flat mode is active
       * @see {@link https://github.com/isaacs/node-glob#globpattern-string--string-options-globoptions--promisestring--path | Node Glob Pattern}
       * @see {@link https://github.com/isaacs/node-glob#glob-primer}
       * */
      filesPattern?: FilesPattern;
    }
  }
}

// eslint-disable-next-line no-undef
export type Configuration = DocusaurusToConfluence.Config;

export type LogLevelOptionDefinition = OptionDefinition<
  LogLevel,
  { hasDefault: true }
>;

export type LogLevelOption = OptionInterfaceOfType<
  LogLevel,
  { hasDefault: true }
>;

export type ModeOptionDefinition = OptionDefinition<
  SyncModes,
  { hasDefault: true }
>;

export type ModeOption = OptionInterfaceOfType<SyncModes, { hasDefault: true }>;

export type FilesPatternOptionDefinition = OptionDefinition<FilesPattern>;

export type FilesPatternOption = OptionInterfaceOfType<FilesPattern>;

/** Creates a DocusaurusToConfluence interface */
export interface DocusaurusToConfluenceConstructor {
  /** Returns DocusaurusToConfluence interface
   * @returns DocusaurusToConfluence instance {@link DocusaurusToConfluenceInterface}.
   */
  // eslint-disable-next-line no-undef
  new (options: DocusaurusToConfluence.Config): DocusaurusToConfluenceInterface;
}

export interface DocusaurusToConfluenceInterface {
  /** Sync pages in Confluence*/
  sync(): Promise<void>;
}
