jest.mock("@src/lib/DocusaurusToConfluence");

import * as customDocusaurusToConfluenceClass from "@src/lib/DocusaurusToConfluence";

export const customDocusaurusToConfluence = {
  sync: jest.fn(),
};

jest
  .spyOn(customDocusaurusToConfluenceClass, "DocusaurusToConfluence")
  .mockImplementation(() => {
    return customDocusaurusToConfluence;
  });
