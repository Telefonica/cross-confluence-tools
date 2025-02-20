// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

/**
 * Check if the value is a string and not empty
 * @param value
 * @returns {boolean}
 */
export function isStringWithLength(value: string): boolean {
  return typeof value === "string" && value.length !== 0;
}
