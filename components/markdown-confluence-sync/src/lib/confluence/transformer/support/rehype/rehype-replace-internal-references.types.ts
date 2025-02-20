// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import type { ConfluenceSyncPage } from "../../../ConfluenceSync.types.js";
/**
 * Options for the RehypeReplaceInternalReferences transformer.
 */
export interface RehypeReplaceInternalReferences {
  /** The space key where the page will be created. */
  spaceKey: string;
  /** Pages map */
  pages: Map<string, ConfluenceSyncPage>;
  /** Remove relative links if missing target */
  removeMissing?: boolean;
}
