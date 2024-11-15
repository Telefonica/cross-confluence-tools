// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import type { ConfluenceInputPage } from "../ConfluenceSyncPages.types";

export function getPagesTitles(pages: ConfluenceInputPage[]): string[] {
  return pages.map((page) => page.title);
}

export function getPagesTitlesCommaSeparated(
  pages: ConfluenceInputPage[],
): string {
  return getPagesTitles(pages).join(", ");
}
