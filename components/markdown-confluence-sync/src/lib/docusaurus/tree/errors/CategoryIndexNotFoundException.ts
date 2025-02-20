// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

export class CategoryIndexNotFoundException extends Error {
  constructor(category: string, options?: ErrorOptions) {
    super(`Category index not found: ${category}`, options);
  }
}
