// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import type { ConfluenceInputPage } from "../ConfluenceSyncPages.types";
import { getPagesTitlesCommaSeparated } from "../support/Pages";

export class NotAncestorsExpectedValidationError extends Error {
  constructor(
    pagesWithAncestors: ConfluenceInputPage[],
    options?: ErrorOptions,
  ) {
    super(
      `Pages with ancestors are not supported in FLAT sync mode: ${getPagesTitlesCommaSeparated(
        pagesWithAncestors,
      )}`,
      options,
    );
  }
}
