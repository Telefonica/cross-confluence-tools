import type { Request as ServerRequest } from "@mocks-server/core";

import type { SpyRequest } from "./SpyStorage.types";

let requests: SpyRequest[] = [];

export function addRequest(routeId: string, request: ServerRequest) {
  requests.push({
    routeId,
    url: request.url,
    method: request.method,
    headers: request.headers,
    body: request.body,
    params: request.params,
  });
}

export function getRequests(): SpyRequest[] {
  return requests;
}

export function resetRequests(): void {
  requests = [];
}
