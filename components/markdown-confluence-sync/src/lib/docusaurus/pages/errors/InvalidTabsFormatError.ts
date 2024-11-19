// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

export class InvalidTabsFormatError extends Error {
  constructor() {
    super("Invalid Tabs tag. The Tabs tag must have only TabItem children.");
  }
}
