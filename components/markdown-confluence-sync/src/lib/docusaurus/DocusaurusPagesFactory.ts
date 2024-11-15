import { SyncModes } from "@tid-cross/confluence-sync";

import { DocusaurusFlatPages } from "./DocusaurusFlatPages.js";
import type { DocusaurusFlatPagesOptions } from "./DocusaurusFlatPages.types.js";
import type { DocusaurusPagesInterface } from "./DocusaurusPages.types.js";
import type {
  DocusaurusPagesFactoryInterface,
  DocusaurusPagesFactoryOptions,
} from "./DocusaurusPagesFactory.types.js";
import { DocusaurusTreePages } from "./DocusaurusTreePages.js";
import type { DocusaurusTreePagesOptions } from "./DocusaurusTreePages.types.js";

export const DocusaurusPagesFactory: DocusaurusPagesFactoryInterface = class DocusaurusPagesFactory {
  public static fromMode(
    mode: SyncModes,
    options: DocusaurusPagesFactoryOptions,
  ): DocusaurusPagesInterface {
    if (!this._isValidMode(mode)) {
      throw new Error(`"mode" option must be one of "tree" or "flat"`);
    }
    if (this._isFlatMode(mode)) {
      return new DocusaurusFlatPages(options as DocusaurusFlatPagesOptions);
    }
    return new DocusaurusTreePages(options as DocusaurusTreePagesOptions);
  }

  private static _isFlatMode(mode: string): boolean {
    return mode === SyncModes.FLAT;
  }

  private static _isValidMode(mode: string): boolean {
    return mode === SyncModes.FLAT || mode === SyncModes.TREE;
  }
};
