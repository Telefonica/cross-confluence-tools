import type { AxiosError } from "axios";

export class UnauthorizedError extends Error {
  constructor(error: AxiosError) {
    super(
      `Unauthorized
              Response: ${JSON.stringify(error.response?.data, null, 2)}`,
      { cause: error },
    );
  }
}
