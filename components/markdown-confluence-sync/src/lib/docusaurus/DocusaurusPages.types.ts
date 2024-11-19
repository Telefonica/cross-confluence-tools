// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import type {
  OptionInterfaceOfType,
  OptionDefinition,
  ConfigInterface,
} from "@mocks-server/config";
import type { LoggerInterface } from "@mocks-server/logger";

import type {
  FilesPatternOption,
  ModeOption,
} from "../MarkdownConfluenceSync.types.js";

export type DocusaurusPageId = string;

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

export interface DocusaurusPagesOptions {
  /** Configuration interface */
  config: ConfigInterface;
  /** Logger */
  logger: LoggerInterface;
  /** Sync mode option */
  mode: ModeOption;
  /** Pattern to search files when flat mode is active */
  filesPattern?: FilesPatternOption;
}

/** Data about one Docusaurus page */
export interface DocusaurusPage {
  /** Docusaurus page title */
  title: string;
  /** Docusaurus page path */
  path: string;
  /** Docusaurus page path relative to docs root dir */
  relativePath: string;
  /** Docusaurus page content */
  content: string;
  /** Docusaurus page ancestors */
  ancestors: string[];
  /**
   * Docusaurus page name
   *
   * Replaces title page in children's title.
   */
  name?: string;
}

/** Creates a DocusaurusToConfluence interface */
export interface DocusaurusPagesConstructor {
  /** Returns DocusaurusPagesInterface interface
   * @returns DocusaurusPages instance {@link DocusaurusPagesInterface}.
   */
  new (options: DocusaurusPagesOptions): DocusaurusPagesInterface;
}

export interface DocusaurusPagesInterface {
  /** Read Docusaurus pages and return a list of Docusaurus page objects */
  read(): Promise<DocusaurusPage[]>;
}

export interface DocusaurusPagesModeOptions {
  /** Configuration interface */
  config: ConfigInterface;
  /** Logger */
  logger: LoggerInterface;
}
