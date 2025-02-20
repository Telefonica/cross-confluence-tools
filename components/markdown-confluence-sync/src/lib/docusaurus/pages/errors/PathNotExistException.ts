// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

export class PathNotExistException extends Error {
  constructor(path: string, options?: ErrorOptions) {
    super(`Path not exist: ${path}`, options);
  }
}
