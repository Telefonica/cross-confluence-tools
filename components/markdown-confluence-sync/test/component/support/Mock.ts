// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import { AdminApiClient } from "@mocks-server/admin-api-client";
import crossFetch from "cross-fetch";

import type { SpyRequest } from "./Mock.types";

const BASE_URL = "http://127.0.0.1:3100";

const DEFAULT_REQUEST_OPTIONS = {
  method: "GET",
};

function mockUrl(path: string) {
  return `${BASE_URL}/${path}`;
}

async function doRequest(path: string, options: RequestInit = {}) {
  const response = await crossFetch(mockUrl(path), {
    ...DEFAULT_REQUEST_OPTIONS,
    ...options,
  });
  return response.json();
}

export function resetRequests(): Promise<SpyRequest[]> {
  return doRequest("spy/requests", {
    method: "DELETE",
  });
}

export function getRequests(): Promise<SpyRequest[]> {
  return doRequest("spy/requests");
}

export async function getRequestsByRouteId(
  routeId: string,
): Promise<SpyRequest[]> {
  const requests = await getRequests();
  return requests.filter((request) => request.routeId === routeId);
}

export async function changeMockCollection(collectionId: string) {
  const mockClient = new AdminApiClient();
  await mockClient.updateConfig({
    mock: {
      collections: {
        selected: collectionId,
      },
    },
  });
}
