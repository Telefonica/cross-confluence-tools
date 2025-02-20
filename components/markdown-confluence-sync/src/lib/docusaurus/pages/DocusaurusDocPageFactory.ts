// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import { DocusaurusDocPage } from "./DocusaurusDocPage.js";
import type { DocusaurusDocPageInterface } from "./DocusaurusDocPage.types.js";
import type {
  DocusaurusDocPageFactoryFromPathOptions,
  DocusaurusDocPageFactoryInterface,
} from "./DocusaurusDocPageFactory.types.js";
import { DocusaurusDocPageMdx } from "./DocusaurusDocPageMdx.js";

export const MarkdownDocFactory: DocusaurusDocPageFactoryInterface = class DocusaurusDocPageFactory {
  public static fromPath(
    path: string,
    options?: DocusaurusDocPageFactoryFromPathOptions,
  ): DocusaurusDocPageInterface {
    if (path.endsWith(".mdx")) {
      return new DocusaurusDocPageMdx(path, options);
    }
    return new DocusaurusDocPage(path, options);
  }
};
