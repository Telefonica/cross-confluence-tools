// SPDX-FileCopyrightText: 2025 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import type { ConfluenceInputPage } from "../ConfluenceSyncPages.types";
import { getPagesTitlesCommaSeparated } from "../support/Pages";

export class PagesWithoutIdException extends Error {
  constructor(pagesWithoutId?: ConfluenceInputPage[], options?: ErrorOptions) {
    super(
      `You are using ID mode and there are pages without id: ${getPagesTitlesCommaSeparated(
        pagesWithoutId as ConfluenceInputPage[],
      )}`,
      options,
    );
  }
}
