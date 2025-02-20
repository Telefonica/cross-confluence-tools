// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

export class InvalidDetailsTagMissingSummaryError extends Error {
  constructor() {
    super("Invalid details tag. The details tag must have a summary tag.");
  }
}
