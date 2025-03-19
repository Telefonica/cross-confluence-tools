// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import type {
  MarkdownDocumentsInterface,
  MarkdownDocumentsModeOptions,
} from "./DocusaurusPages.types";

export interface DocusaurusTreePagesOptions
  extends MarkdownDocumentsModeOptions {
  /**  Markdown document path */
  path?: string;
  /** Current working directory */
  cwd: string;
}

/** Creates a DocusaurusTreePagesMode interface */
export interface DocusaurusTreePagesConstructor {
  /** Returns DocusaurusPagesInterface interface
   * @param {DocusaurusTreePagesOptions} options
   * @returns DocusaurusPagesMode instance {@link MarkdownDocumentsInterface}.
   */
  new (options: DocusaurusTreePagesOptions): MarkdownDocumentsInterface;
}
