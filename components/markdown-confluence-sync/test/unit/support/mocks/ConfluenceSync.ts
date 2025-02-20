// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

jest.mock("@src/lib/confluence/ConfluenceSync");

import * as confluenceSyncMock from "@src/lib/confluence/ConfluenceSync";

export const customConfluenceSync = {
  sync: jest.fn(),
};

/* ts ignore next line because it expects a mock with the same parameters as the ConfluenceSync class
 * but there are a lot of them useless for the test */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore-next-line
jest.spyOn(confluenceSyncMock, "ConfluenceSync").mockImplementation(() => {
  return customConfluenceSync;
});
