// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

export class AttachmentsNotFoundError extends Error {
  constructor(id: string, options?: ErrorOptions) {
    super(
      `Error getting attachments of page with id ${id}: ${options?.cause}`,
      options,
    );
  }
}
