import type { ConfluenceInputPage } from "../ConfluenceSyncPages.types";
import { SyncModes } from "../ConfluenceSyncPages.types";
import { getPagesTitlesCommaSeparated } from "../support/Pages";

export class RootPageRequiredException extends Error {
  constructor(
    mode: SyncModes,
    pagesWithoutId?: ConfluenceInputPage[],
    options?: ErrorOptions,
  ) {
    /* istanbul ignore else */
    if (mode === SyncModes.TREE) {
      super("rootPageId is required for TREE sync mode", options);
    } else if (mode === SyncModes.FLAT) {
      super(
        `rootPageId is required for FLAT sync mode when there are pages without id: ${getPagesTitlesCommaSeparated(
          pagesWithoutId as ConfluenceInputPage[],
        )}`,
        options,
      );
    } else {
      /* istanbul ignore next */
      super("Unknown sync mode", options);
    }
  }
}
