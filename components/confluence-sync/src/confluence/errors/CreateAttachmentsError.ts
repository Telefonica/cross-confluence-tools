// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

export class CreateAttachmentsError extends Error {
  constructor(id: string, options?: ErrorOptions) {
    super(
      `Error creating attachments of page with id ${id}: ${options?.cause}`,
      options,
    );
  }
}
