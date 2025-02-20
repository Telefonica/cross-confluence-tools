// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

export class CreatePageError extends Error {
  constructor(title: string, options?: ErrorOptions) {
    super(
      `Error creating page with title ${title}: ${options?.cause}`,
      options,
    );
  }
}
