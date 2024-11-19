// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import type { AxiosError } from "axios";
import { HttpStatusCode } from "axios";

import { BadRequestError } from "./axios/BadRequestError";
import { InternalServerError } from "./axios/InternalServerError";
import { UnauthorizedError } from "./axios/UnauthorizedError";
import { UnexpectedError } from "./axios/UnexpectedError";
import { UnknownAxiosError } from "./axios/UnknownAxiosError";

export function toConfluenceClientError(error: unknown): Error {
  if ((error as AxiosError).name === "AxiosError") {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === HttpStatusCode.BadRequest) {
      return new BadRequestError(axiosError);
    }
    if (
      axiosError.response?.status === HttpStatusCode.Unauthorized ||
      axiosError.response?.status === HttpStatusCode.Forbidden
    ) {
      return new UnauthorizedError(axiosError);
    }
    if (axiosError.response?.status === HttpStatusCode.InternalServerError) {
      return new InternalServerError(axiosError);
    }

    return new UnknownAxiosError(axiosError);
  }
  return new UnexpectedError(error);
}
