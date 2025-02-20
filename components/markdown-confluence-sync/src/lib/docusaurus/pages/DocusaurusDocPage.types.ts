// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import type { LoggerInterface } from "@mocks-server/logger";
import { FilesMetadata } from "../../MarkdownConfluenceSync.types";

/** Docusaurus file metadata */
export interface DocusaurusDocPageMeta {
  /** Returns file title */
  readonly title: string;
  /** Returns true if the file needs to be synch with Confluence */
  readonly syncToConfluence: boolean;
  /**
   * Returns Confluence page name
   *
   * Replace page title in children's titles.
   */
  readonly confluenceShortName?: string;
  /**
   * Returns Confluence page title
   * Replace page title in Confluence.
   */
  readonly confluenceTitle?: string;
  /**
   * If the flat mode is active you can return the confluence page id to use it as root page.
   *
   */
  readonly confluencePageId?: string;
}

export interface DocusaurusDocPageInterface {
  /** Returns true if the file is a category, false otherwise */
  isCategory: boolean;
  /** Returns path to the file represented by the file */
  path: string;
  /**
   * Returns the file meta information
   * @see {@link DocusaurusDocPageMeta}
   */
  meta: DocusaurusDocPageMeta;
  /** Returns the file content in HTML format*/
  content: string;
}

export interface DocusaurusDocPageOptions {
  /** Logger */
  logger?: LoggerInterface;
  /** Files metadata */
  filesMetadata?: FilesMetadata;
}

/** Creates DocusaurusDocPage interface */
export interface DocusaurusDocPageConstructor {
  /** Returns DocusaurusDocPage interface
   *
   * @param {string} path - Path to the page
   * @returns {DocusaurusDocPage} instance {@link DocusaurusDocPageInterface}.
   * @throws {Error} If the path does not exist.
   * @throws {Error} If the path is not a markdown file.
   */
  new (
    path: string,
    options?: DocusaurusDocPageOptions,
  ): DocusaurusDocPageInterface;
}
