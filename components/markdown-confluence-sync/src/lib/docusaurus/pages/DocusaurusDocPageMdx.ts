// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import type { LoggerInterface } from "@mocks-server/logger";
import { remark } from "remark";
import remarkDirective from "remark-directive";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkParseFrontmatter from "remark-parse-frontmatter";
import type { VFile } from "vfile";

import { readMarkdownAndPatchDocusaurusAdmonitions } from "../util/files.js";

import { DocusaurusDocPage } from "./DocusaurusDocPage.js";
import type {
  DocusaurusDocPageConstructor,
  DocusaurusDocPageOptions,
} from "./DocusaurusDocPage.types.js";
import remarkRemoveMdxCode from "./support/remark/remark-remove-mdx-code.js";
import remarkReplaceAdmonitions from "./support/remark/remark-replace-admonitions.js";
import remarkReplaceTabs from "./support/remark/remark-replace-tabs.js";
import remarkTransformDetails from "./support/remark/remark-transform-details.js";
import remarkValidateFrontmatter from "./support/remark/remark-validate-frontmatter.js";
import { FrontMatterValidator } from "./support/validators/FrontMatterValidator.js";

export const DocusaurusDocPageMdx: DocusaurusDocPageConstructor = class DocusaurusDocPageMdx extends DocusaurusDocPage {
  constructor(path: string, options?: DocusaurusDocPageOptions) {
    super(path, options);
  }

  protected _parseFile(
    path: string,
    options?: { logger?: LoggerInterface },
  ): VFile {
    return remark()
      .use(remarkMdx)
      .use(remarkGfm)
      .use(remarkFrontmatter)
      .use(remarkReplaceTabs)
      .use(remarkTransformDetails)
      .use(remarkRemoveMdxCode)
      .use(remarkDirective)
      .use(remarkParseFrontmatter)
      .use(remarkValidateFrontmatter, FrontMatterValidator)
      .use(remarkReplaceAdmonitions)
      .processSync(
        readMarkdownAndPatchDocusaurusAdmonitions(path, {
          logger: options?.logger,
        }),
      );
  }
};
