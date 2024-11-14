jest.mock("@src/lib/docusaurus/DocusaurusPages");

import * as customDocusaurusPagesLib from "@src/lib/docusaurus/DocusaurusPages";

export const customDocusaurusPages = {
  read: jest.fn(),
};

jest
  .spyOn(customDocusaurusPagesLib, "DocusaurusPages")
  .mockImplementation(() => {
    return customDocusaurusPages;
  });
