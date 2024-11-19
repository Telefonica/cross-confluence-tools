// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import type { FilesPattern } from "../MarkdownConfluenceSync.types";

import type {
  DocusaurusPagesInterface,
  DocusaurusPagesModeOptions,
} from "./DocusaurusPages.types";

export interface DocusaurusFlatPagesOptions extends DocusaurusPagesModeOptions {
  /** Pattern to search files when flat mode is active */
  filesPattern?: FilesPattern;
}

/** Creates a DocusaurusFlatPagesMode interface */
export interface DocusaurusFlatPagesConstructor {
  /** Returns DocusaurusPagesInterface interface
   * @param {DocusaurusFlatPagesOptions} options
   * @returns DocusaurusPagesMode instance {@link DocusaurusPagesInterface}.
   */
  new (options: DocusaurusFlatPagesOptions): DocusaurusPagesInterface;
}
