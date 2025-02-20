// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import type { LoggerInterface } from "@mocks-server/logger";

import type { DocusaurusDocPageInterface } from "./DocusaurusDocPage.types";
import { FilesMetadata } from "../../MarkdownConfluenceSync.types";

export interface DocusaurusDocPageFactoryFromPathOptions {
  /** Logger */
  logger?: LoggerInterface;
  /** Files metadata */
  filesMetadata?: FilesMetadata;
}

/**
 * Factory for creating DocusaurusDocPage instances.
 *
 * @export DocusaurusDocPageFactory
 */
export interface DocusaurusDocPageFactoryInterface {
  /**
   * Creates a new DocusaurusDocPage instance from the given path.
   *
   * If the path is an mdx file, the {@link DocusaurusDocPageMdx} will be parsed with mdx instructions.
   * Otherwise, the {@link DocusaurusDocPage} will be the parser with md instructions.
   *
   * @param path - The path to create the DocusaurusDocPage from.
   *
   * @returns A new DocusaurusDocPage instance.
   */
  fromPath(
    path: string,
    options?: DocusaurusDocPageFactoryFromPathOptions,
  ): DocusaurusDocPageInterface;
}
