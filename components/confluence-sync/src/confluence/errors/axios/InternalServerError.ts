// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import type { AxiosError } from "axios";

export class InternalServerError extends Error {
  constructor(error: AxiosError) {
    super(
      `Internal Server Error
                  Response: ${JSON.stringify(error.response?.data, null, 2)}`,
      { cause: error },
    );
  }
}
