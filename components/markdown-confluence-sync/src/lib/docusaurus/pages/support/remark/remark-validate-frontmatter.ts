// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import type { Root } from "mdast";
import type { Plugin as UnifiedPlugin } from "unified";
import type { Schema } from "zod";
import { ZodError } from "zod";

/**
 * UnifiedPlugin to validate FrontMatter metadata with given schema.
 *
 * @throws {Error} if the admonitions is not well constructed.
 *
 * @see {@link https://docusaurus.io/docs/markdown-features/admonitions | Docusaurus Admonitions}
 */
const remarkValidateFrontmatter: UnifiedPlugin<
  Array<Schema>,
  Root
> = function remarkRemoveAdmonitions(schema) {
  return function (_tree, file) {
    try {
      file.data.frontmatter = schema.parse(file.data.frontmatter);
    } catch (e) {
      if (e instanceof ZodError) {
        const message = e.errors.map((error) => error.message).join("\n");
        file.fail(message, undefined, "remark-validate-frontmatter");
      } else {
        throw e;
      }
    }
  };
};

export default remarkValidateFrontmatter;
