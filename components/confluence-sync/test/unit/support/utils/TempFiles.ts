// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import type { DirOptions, FileOptions } from "tmp";
import { fileSync, dirSync } from "tmp";

/**
 * Class to wrap tmp package functions and solve problems with windows
 */
export const TempFiles = class TempFiles {
  public dirSync(this: void, options: DirOptions) {
    return dirSync({ ...options });
  }

  /**
   * FIX: Add discardDescriptor option to correct error when removing temporary
   * files in Windows when using the removeCallback option of the dirSync function
   * @param {FileOptions} options
   * @returns {FileResult}
   */
  public fileSync(this: void, options: FileOptions = {}) {
    return fileSync({ discardDescriptor: true, ...options });
  }
};
