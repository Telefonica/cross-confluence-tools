// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import { existsSync, lstatSync } from "node:fs";
import { join } from "node:path";

import type { LoggerInterface } from "@mocks-server/logger";
import { remark } from "remark";
import remarkDirective from "remark-directive";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkParseFrontmatter from "remark-parse-frontmatter";
import type { VFile } from "vfile";

import {
  isSupportedFile,
  readMarkdownAndPatchDocusaurusAdmonitions,
} from "../util/files.js";

import type {
  DocusaurusDocPageConstructor,
  DocusaurusDocPageInterface,
  DocusaurusDocPageMeta,
  DocusaurusDocPageOptions,
} from "./DocusaurusDocPage.types.js";
import { InvalidMarkdownFormatException } from "./errors/InvalidMarkdownFormatException.js";
import { InvalidPathException } from "./errors/InvalidPathException.js";
import { PathNotExistException } from "./errors/PathNotExistException.js";
import remarkReplaceAdmonitions from "./support/remark/remark-replace-admonitions.js";
import remarkValidateFrontmatter from "./support/remark/remark-validate-frontmatter.js";
import type { FrontMatter } from "./support/validators/FrontMatterValidator.js";
import { FrontMatterValidator } from "./support/validators/FrontMatterValidator.js";

export const DocusaurusDocPage: DocusaurusDocPageConstructor = class DocusaurusDocPage
  implements DocusaurusDocPageInterface
{
  protected _vFile: VFile;

  constructor(path: string, options?: DocusaurusDocPageOptions) {
    if (!existsSync(join(path))) {
      throw new PathNotExistException(`Path ${path} does not exist`);
    }
    if (!lstatSync(path).isFile()) {
      throw new InvalidPathException(`Path ${path} is not a file`);
    }
    if (!isSupportedFile(path)) {
      throw new InvalidPathException(`Path ${path} is not a markdown file`);
    }
    try {
      this._vFile = this._parseFile(path, options);
    } catch (e) {
      throw new InvalidMarkdownFormatException(
        `Invalid markdown format: ${path}`,
        { cause: e },
      );
    }
  }

  public get isCategory(): boolean {
    return false;
  }

  public get path(): string {
    return this._vFile.path;
  }

  public get meta(): DocusaurusDocPageMeta {
    const frontmatter = this._vFile.data.frontmatter as FrontMatter;
    return {
      title: frontmatter.title,
      syncToConfluence: frontmatter.sync_to_confluence,
      confluenceShortName: frontmatter.confluence_short_name,
      confluenceTitle: frontmatter.confluence_title,
      confluencePageId: frontmatter.confluence_page_id,
    };
  }

  public get content(): string {
    return this._vFile.toString();
  }

  protected _parseFile(
    path: string,
    options?: { logger?: LoggerInterface },
  ): VFile {
    return remark()
      .use(remarkGfm)
      .use(remarkFrontmatter)
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
