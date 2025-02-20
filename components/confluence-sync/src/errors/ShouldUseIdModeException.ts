// SPDX-FileCopyrightText: 2025 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

export class ShouldUseIdModeException extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}
