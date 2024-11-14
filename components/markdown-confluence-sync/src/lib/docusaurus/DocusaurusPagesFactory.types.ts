import type { ConfigInterface } from "@mocks-server/config";
import type { LoggerInterface } from "@mocks-server/logger";
import type { SyncModes } from "@telefonica-cross/confluence-sync";

import type { FilesPattern } from "..";

import type { DocusaurusPagesInterface } from "./DocusaurusPages.types";

export interface DocusaurusPagesFactoryOptions {
  /** Configuration interface */
  config: ConfigInterface;
  /** Logger */
  logger: LoggerInterface;
  /**  Docusaurus page path */
  path: string;
  /** Pattern to search files when flat mode is active */
  filesPattern?: FilesPattern;
}

/**
 * Factory for creating DocusaurusPages instances.
 *
 *
 * @export DocusaurusDocFactory
 */
export interface DocusaurusPagesFactoryInterface {
  /**
   * Creates a new page from the category index.
   *
   * If the mode is flat {@link DocusaurusFlatPages} will be obtained pages in flat mode.
   * Otherwise, the {@link DocusaurusTreePages} will be  obtained pages in tree mode.
   *
   * @param options ${DocusaurusPagesFactoryOptions} - The options to obtained docusaurus pages.
   *
   * @returns A new DocusaurusPagesInterface instance.
   */
  fromMode(
    mode: SyncModes,
    options: DocusaurusPagesFactoryOptions,
  ): DocusaurusPagesInterface;
}
