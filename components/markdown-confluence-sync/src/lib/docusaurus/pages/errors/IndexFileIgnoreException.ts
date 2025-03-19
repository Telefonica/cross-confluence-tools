// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

export class IndexFileIgnoreException extends Error {
  constructor(path: string, options?: ErrorOptions) {
    super(`Category index file ignored: ${path}`, options);
  }
}
