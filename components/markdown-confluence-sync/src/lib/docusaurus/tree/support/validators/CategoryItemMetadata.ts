// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import z from "zod";

/**
 * Validator for CategoryItemMetadata.
 *
 * @see {@link https://docusaurus.io/docs/sidebar#category-item-metadata | Docusaurus Category Item Metadata}
 */
export const CategoryItemMetadataValidator = z.object({
  label: z.string().nonempty().optional(),
});
