// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

export class CompoundError extends Error {
  public readonly errors: Error[];

  constructor(...errors: Error[]) {
    super(errors.map((error) => error.message).join("\n"));
    this.errors = errors;
  }
}
