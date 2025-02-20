// SPDX-FileCopyrightText: 2025 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import { SyncModes } from "../ConfluenceSyncPages.types";

export class InvalidSyncModeException extends Error {
  constructor(syncMode: string, options?: ErrorOptions) {
    super(
      `Invalid sync mode "${syncMode}". Please use one of "${SyncModes.FLAT}", "${SyncModes.TREE}" or "${SyncModes.ID}"`,
      options,
    );
  }
}
