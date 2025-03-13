// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import type {
  OptionDefinition,
  OptionInterfaceOfType,
} from "@mocks-server/config";
import type { LogLevel } from "@mocks-server/logger";
import type { SyncModes } from "@tid-xcut/confluence-sync";

export type FilesPattern = string | string[];

export interface FileMetadata {
  /** Path to the file */
  path: string;
  /** Confluence page id */
  id?: string;
  /** Confluence page title */
  title?: string;
  /** Short name of the page to be used in the names of the child pages, when assigning namespacing */
  shortName?: string;
  /** Whether to sync or not the page */
  sync?: boolean;
}

export type FilesMetadata = FileMetadata[];

export interface PreprocessorsOptions {
  /** Path to the file */
  path: string;
  /** Relative path to the file */
  relativePath: string;
}

export type ContentPreprocessor = (
  content: string,
  options: PreprocessorsOptions,
) => Promise<string> | string;

export type TitlePreprocessor = (
  title: string,
  options: PreprocessorsOptions,
) => Promise<string> | string;

export type Preprocessors = {
  content?: ContentPreprocessor;
  title?: TitlePreprocessor;
};

declare global {
  //eslint-disable-next-line @typescript-eslint/no-namespace
  namespace MarkdownConfluenceSync {
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
      /** Working Directory */
      cwd?: string;
      /** Mode to structure pages */
      mode?: SyncModes;
      /**
       * Pattern to search files when flat or id mode are active
       * @see {@link https://github.com/isaacs/node-glob#globpattern-string--string-options-globoptions--promisestring--path | Node Glob Pattern}
       * @see {@link https://github.com/isaacs/node-glob#glob-primer}
       * */
      filesPattern?: FilesPattern;

      /** Metadata for specific files */
      filesMetadata?: FilesMetadata;

      preprocessors?: Preprocessors;
    }
  }
}

// eslint-disable-next-line no-undef
export type Configuration = MarkdownConfluenceSync.Config;

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

export type FilesMetadataOptionDefinition = OptionDefinition<FilesMetadata>;

export type FilesMetadataOption = OptionInterfaceOfType<FilesMetadata>;

export type ContentPreprocessorOptionDefinition =
  OptionDefinition<ContentPreprocessor>;

export type TitlePreprocessorOptionDefinition =
  OptionDefinition<TitlePreprocessor>;

export type ContentPreprocessorOption =
  OptionInterfaceOfType<ContentPreprocessor>;

export type TitlePreprocessorOption = OptionInterfaceOfType<TitlePreprocessor>;

/** Creates a MarkdownConfluenceSync interface */
export interface MarkdownConfluenceSyncConstructor {
  /** Returns MarkdownConfluenceSync interface
   * @returns MarkdownConfluenceSync instance {@link MarkdownConfluenceSyncInterface}.
   */
  // eslint-disable-next-line no-undef
  new (options: MarkdownConfluenceSync.Config): MarkdownConfluenceSyncInterface;
}

export interface MarkdownConfluenceSyncInterface {
  /** Sync pages in Confluence*/
  sync(): Promise<void>;
}
