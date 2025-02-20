// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import { SyncModes } from "../ConfluenceSyncPages.types";

export class RootPageRequiredException extends Error {
  constructor(mode: SyncModes, options?: ErrorOptions) {
    /* istanbul ignore else */
    if (mode === SyncModes.TREE) {
      super("rootPageId is required for TREE sync mode", options);
    } else if (mode === SyncModes.FLAT) {
      super("rootPageId is required for FLAT sync mode", options);
    } else {
      /* istanbul ignore next */
      super("Unknown sync mode", options);
    }
  }
}
