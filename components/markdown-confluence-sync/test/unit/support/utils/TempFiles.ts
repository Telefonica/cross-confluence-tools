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
    // TODO: Revert to its original state. Just a change for testing caches
    return fileSync({ discardDescriptor: false, ...options });
  }
};
