// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

export class UnexpectedError extends Error {
  constructor(error: unknown) {
    super(`Unexpected Error: ${error}`);
  }
}
