// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import { SyncModes } from "@tid-xcut/confluence-sync";

import { MarkdownFlatDocuments } from "./DocusaurusFlatPages.js";
import type { MarkdownFlatDocumentsOptions } from "./DocusaurusFlatPages.types.js";
import type { MarkdownDocumentsInterface } from "./DocusaurusPages.types.js";
import type {
  MarkdownDocumentsFactoryInterface,
  MarkdownDocumentsFactoryOptions,
} from "./DocusaurusPagesFactory.types.js";
import { DocusaurusTreePages } from "./DocusaurusTreePages.js";
import type { DocusaurusTreePagesOptions } from "./DocusaurusTreePages.types.js";

export const MarkdownDocumentsFactory: MarkdownDocumentsFactoryInterface = class MarkdownDocumentsFactory {
  public static fromMode(
    mode: SyncModes,
    options: MarkdownDocumentsFactoryOptions,
  ): MarkdownDocumentsInterface {
    if (!this._isValidMode(mode)) {
      throw new Error(`"mode" option must be one of "tree" or "flat"`);
    }
    if (this._isFlatMode(mode)) {
      return new MarkdownFlatDocuments(options as MarkdownFlatDocumentsOptions);
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
