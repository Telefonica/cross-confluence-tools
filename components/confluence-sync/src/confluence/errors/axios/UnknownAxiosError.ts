import type { AxiosError } from "axios";

export class UnknownAxiosError extends Error {
  constructor(error: AxiosError) {
    super(
      `Axios Error
                      Response: ${JSON.stringify(error.response?.data, null, 2)}`,
      { cause: error },
    );
  }
}
