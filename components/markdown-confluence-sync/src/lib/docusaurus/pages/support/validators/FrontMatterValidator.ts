// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import z from "zod";

/**
 * Validator for FrontMatter.
 *
 * @see {@link https://docusaurus.io/docs/create-doc#doc-front-matter | Doc front matter}
 */
export const FrontMatterValidator = z.object({
  title: z.string().nonempty().optional(),
  sync_to_confluence: z.boolean().optional().default(false),
  confluence_short_name: z.string().nonempty().optional(),
  confluence_title: z.string().nonempty().optional(),
  confluence_page_id: z.string().optional(),
});

export type FrontMatter = z.infer<typeof FrontMatterValidator>;
