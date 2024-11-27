// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

jest.mock("@src/lib/docusaurus/DocusaurusPages");

import * as customDocusaurusPagesLib from "@src/lib/docusaurus/DocusaurusPages";

export const customDocusaurusPages = {
  read: jest.fn(),
};

jest
  .spyOn(customDocusaurusPagesLib, "MarkdownDocuments")
  .mockImplementation(() => {
    return customDocusaurusPages;
  });
