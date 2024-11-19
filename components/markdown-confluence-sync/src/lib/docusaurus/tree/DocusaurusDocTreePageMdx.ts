// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import { isStringWithLength } from "../../support/typesValidations.js";
import type { DocusaurusDocPageOptions } from "../pages/DocusaurusDocPage.types.js";
import { DocusaurusDocPageMdx } from "../pages/DocusaurusDocPageMdx.js";
import { isNotIndexFile } from "../util/files.js";

import type { DocusaurusDocTreeItem } from "./DocusaurusDocTree.types.js";
import type {
  DocusaurusDocTreePageConstructor,
  DocusaurusDocTreePageInterface,
} from "./DocusaurusDocTreePage.types.js";

export const DocusaurusDocTreePageMdx: DocusaurusDocTreePageConstructor = class DocusaurusDocTreePageMdx
  extends DocusaurusDocPageMdx
  implements DocusaurusDocTreePageInterface
{
  constructor(path: string, options?: DocusaurusDocPageOptions) {
    super(path, options);
    if (
      isNotIndexFile(path) &&
      isStringWithLength(this.meta.confluenceShortName as string)
    ) {
      options?.logger?.warn(
        "An unnecessary confluence short name has been set for a file that is not index.md or index.mdx. This confluence short name will be ignored.",
      );
    }
  }

  public async visit(): Promise<DocusaurusDocTreeItem[]> {
    return this.meta.syncToConfluence ? [this] : [];
  }
};
