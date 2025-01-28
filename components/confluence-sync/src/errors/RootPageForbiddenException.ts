// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

export class RootPageForbiddenException extends Error {
  constructor(options?: ErrorOptions) {
    super("rootPageId option is not allowed in ID mode", options);
  }
}
