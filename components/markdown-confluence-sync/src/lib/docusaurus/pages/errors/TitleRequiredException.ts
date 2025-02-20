// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

export class TitleRequiredException extends Error {
  constructor(path: string, options?: ErrorOptions) {
    super(
      `Title is required: ${path}. Please provide it using frontmatter or filesMetadata option`,
      options,
    );
  }
}
