// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

export class PageNotFoundError extends Error {
  constructor(id: string, options?: ErrorOptions) {
    super(`Error getting page with id ${id}: ${options?.cause}`, options);
  }
}
