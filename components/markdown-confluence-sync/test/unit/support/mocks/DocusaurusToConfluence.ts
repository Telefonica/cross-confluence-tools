// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

jest.mock("@src/lib/MarkdownConfluenceSync");

import * as customMarkdownConfluenceSyncClass from "@src/lib/MarkdownConfluenceSync";

export const customMarkdownConfluenceSync = {
  sync: jest.fn(),
};

jest
  .spyOn(customMarkdownConfluenceSyncClass, "MarkdownConfluenceSync")
  .mockImplementation(() => {
    return customMarkdownConfluenceSync;
  });
