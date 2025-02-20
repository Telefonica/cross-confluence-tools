// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

export class InvalidMarkdownFormatException extends Error {
  constructor(path: string, options?: ErrorOptions) {
    super(`Invalid markdown format: ${path}`, options);
  }
}
