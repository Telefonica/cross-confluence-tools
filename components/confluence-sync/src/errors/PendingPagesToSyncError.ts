// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import type { ConfluenceInputPage } from "../ConfluenceSyncPages.types";
import { getPagesTitlesCommaSeparated } from "../support/Pages";

export class PendingPagesToSyncError extends Error {
  constructor(
    pendingPagesToSync: ConfluenceInputPage[],
    options?: ErrorOptions,
  ) {
    super(
      `There still are ${
        pendingPagesToSync.length
      } pages to create after sync: ${getPagesTitlesCommaSeparated(
        pendingPagesToSync,
      )}, check if they have their ancestors created.`,
      options,
    );
  }
}
