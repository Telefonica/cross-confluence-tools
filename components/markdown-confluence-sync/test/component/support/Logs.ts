// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

export function cleanLogs(logs: string[]) {
  return logs.map((log) => log.replace(/^(\S|\s)*\]/, "").trim());
}
