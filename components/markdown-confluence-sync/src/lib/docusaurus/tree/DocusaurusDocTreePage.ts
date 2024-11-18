// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import { basename } from "node:path";

import { isStringWithLength } from "../../support/typesValidations.js";
import { DocusaurusDocPage } from "../pages/DocusaurusDocPage.js";
import type { DocusaurusDocPageOptions } from "../pages/DocusaurusDocPage.types.js";
import { isNotIndexFile } from "../util/files.js";

import type { DocusaurusDocTreeItem } from "./DocusaurusDocTree.types.js";
import type {
  DocusaurusDocTreePageConstructor,
  DocusaurusDocTreePageInterface,
} from "./DocusaurusDocTreePage.types.js";

export const DocusaurusDocTreePage: DocusaurusDocTreePageConstructor = class DocusaurusDocTreePage
  extends DocusaurusDocPage
  implements DocusaurusDocTreePageInterface
{
  constructor(path: string, options?: DocusaurusDocPageOptions) {
    super(path, options);
    if (
      isNotIndexFile(path) &&
      isStringWithLength(this.meta.confluenceShortName as string)
    ) {
      options?.logger?.warn(
        `An unnecessary confluence short name has been set for ${basename(
          path,
        )} that is not an index file. This confluence short name will be ignored.`,
      );
    }
  }

  public async visit(): Promise<DocusaurusDocTreeItem[]> {
    return this.meta.syncToConfluence ? [this] : [];
  }
};
