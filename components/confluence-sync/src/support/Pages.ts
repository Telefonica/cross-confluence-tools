import type { ConfluenceInputPage } from "../ConfluenceSyncPages.types";

export function getPagesTitles(pages: ConfluenceInputPage[]): string[] {
  return pages.map((page) => page.title);
}

export function getPagesTitlesCommaSeparated(
  pages: ConfluenceInputPage[],
): string {
  return getPagesTitles(pages).join(", ");
}
