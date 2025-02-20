// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

export class DeletePageError extends Error {
  constructor(id: string, options?: ErrorOptions) {
    super(`Error deleting content with id ${id}: ${options?.cause}`, options);
  }
}
