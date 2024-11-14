import type { AxiosError } from "axios";

export class BadRequestError extends Error {
  constructor(error: AxiosError) {
    super(
      `Bad Request
          Response: ${JSON.stringify(error.response?.data, null, 2)}`,
      { cause: error },
    );
  }
}
