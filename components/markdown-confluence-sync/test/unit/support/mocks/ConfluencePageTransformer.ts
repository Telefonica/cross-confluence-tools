// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

jest.mock("@src/lib/confluence/transformer/ConfluencePageTransformer");

import * as customConfluencePageLib from "@src/lib/confluence/transformer/ConfluencePageTransformer";

export const customConfluencePage = {
  transform: jest.fn(),
};

jest
  .spyOn(customConfluencePageLib, "ConfluencePageTransformer")
  .mockImplementation(() => {
    return customConfluencePage;
  });
