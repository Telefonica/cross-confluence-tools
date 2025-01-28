// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import type {
  OptionInterfaceOfType,
  OptionDefinition,
  ConfigInterface,
} from "@mocks-server/config";
import type { LoggerInterface } from "@mocks-server/logger";

import type {
  FilesMetadataOption,
  FilesPatternOption,
  FilesMetadata,
  ModeOption,
} from "../MarkdownConfluenceSync.types.js";

export type MarkdownPageId = string;

type DocsDirOptionValue = string;

declare global {
  //eslint-disable-next-line @typescript-eslint/no-namespace
  namespace MarkdownConfluenceSync {
    interface Config {
      /** Documents directory */
      docsDir?: DocsDirOptionValue;
    }
  }
}

export type DocsDirOptionDefinition = OptionDefinition<
  DocsDirOptionValue,
  { hasDefault: true }
>;

export type DocsDirOption = OptionInterfaceOfType<
  DocsDirOptionValue,
  { hasDefault: true }
>;

export interface MarkdownDocumentsOptions {
  /** Configuration interface */
  config: ConfigInterface;
  /** Logger */
  logger: LoggerInterface;
  /** Sync mode option */
  mode: ModeOption;
  /** Pattern to search files when flat mode is active */
  filesPattern?: FilesPatternOption;
  /** Metadata for specific files */
  filesMetadata?: FilesMetadataOption;
  /** Working directory */
  cwd: string;
}

/** Data about one markdown file */
export interface MarkdownDocument {
  /** markdown file title */
  title: string;
  /** markdown file path */
  path: string;
  /** markdown file path relative to docs root dir */
  relativePath: string;
  /** markdown file content */
  content: string;
  /** markdown file ancestors */
  ancestors: string[];
  /**
   * markdown file name
   *
   * Replaces title page in children's title.
   */
  name?: string;
}

/** Creates a MarkdownDocuments interface */
export interface MarkdownDocumentsConstructor {
  /** Returns MarkdownDocumentsInterface interface
   * @returns  MarkdownDocuments instance {@link MarkdownDocumentsInterface}.
   */
  new (options: MarkdownDocumentsOptions): MarkdownDocumentsInterface;
}

export interface MarkdownDocumentsInterface {
  /** Read markdown files and return a list of markdown file objects */
  read(): Promise<MarkdownDocument[]>;
}

export interface MarkdownDocumentsModeOptions {
  /** Metadata for specific files */
  filesMetadata?: FilesMetadata;
  /** Configuration interface */
  config: ConfigInterface;
  /** Logger */
  logger: LoggerInterface;
}
