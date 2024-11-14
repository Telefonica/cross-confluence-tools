import type {
  DocusaurusPagesInterface,
  DocusaurusPagesModeOptions,
} from "./DocusaurusPages.types";

export interface DocusaurusTreePagesOptions extends DocusaurusPagesModeOptions {
  /**  Docusaurus page path */
  path?: string;
}

/** Creates a DocusaurusTreePagesMode interface */
export interface DocusaurusTreePagesConstructor {
  /** Returns DocusaurusPagesInterface interface
   * @param {DocusaurusTreePagesOptions} options
   * @returns DocusaurusPagesMode instance {@link DocusaurusPagesInterface}.
   */
  new (options: DocusaurusTreePagesOptions): DocusaurusPagesInterface;
}
