// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

export class InvalidTabItemMissingLabelError extends Error {
  constructor() {
    super("Invalid TabItem tag. The TabItem tag must have a label property.");
  }
}
