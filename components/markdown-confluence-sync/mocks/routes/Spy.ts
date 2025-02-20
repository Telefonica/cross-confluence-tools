// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import type {
  Request as ServerRequest,
  Response as ServerResponse,
  RouteDefinition,
} from "@mocks-server/core";

import { getRequests, resetRequests } from "../support/SpyStorage";

const spyRoutes: RouteDefinition[] = [
  {
    id: "spy-get-requests",
    url: "/spy/requests",
    method: "GET",
    variants: [
      {
        id: "send",
        type: "middleware",
        options: {
          middleware: (_req: ServerRequest, res: ServerResponse) => {
            res.status(200).send(getRequests());
          },
        },
      },
    ],
  },
  {
    id: "spy-reset-requests",
    url: "/spy/requests",
    method: "DELETE",
    variants: [
      {
        id: "reset",
        type: "middleware",
        options: {
          middleware: (_req: ServerRequest, res: ServerResponse) => {
            resetRequests();
            res.status(200).send({ reset: true });
          },
        },
      },
    ],
  },
];

export default spyRoutes;
