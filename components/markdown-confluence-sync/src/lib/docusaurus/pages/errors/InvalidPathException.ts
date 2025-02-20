// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

export class InvalidPathException extends Error {
  constructor(path: string, options?: ErrorOptions) {
    super(`Invalid file: ${path}`, options);
  }
}
