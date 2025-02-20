// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

jest.mock("@src/confluence/CustomConfluenceClient");

import type { LoggerInterface } from "@mocks-server/logger";

import * as customClientLib from "@src/confluence/CustomConfluenceClient";

export const customClient = {
  getPage: jest.fn(),
  createPage: jest.fn().mockImplementation((page) => Promise.resolve(page)),
  updatePage: jest.fn().mockImplementation((page) => Promise.resolve(page)),
  deleteContent: jest.fn(),
  getAttachments: jest.fn(),
  createAttachments: jest.fn(),
  logger: {} as LoggerInterface,
};

jest.spyOn(customClientLib, "CustomConfluenceClient").mockImplementation(() => {
  return customClient;
});
