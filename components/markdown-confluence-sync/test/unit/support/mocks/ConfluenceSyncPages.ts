jest.mock("@tid-cross/confluence-sync");

import * as confluenceSyncPagesMock from "@tid-cross/confluence-sync";

export const customConfluenceSyncPages = {
  sync: jest.fn(),
};

/* ts ignore next line because it expects a mock with the same parameters as the ConfluenceSyncPages class
 * but there are a lot of them useless for the test */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore-next-line
jest
  .spyOn(confluenceSyncPagesMock, "ConfluenceSyncPages")
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore-next-line
  .mockImplementation(() => {
    return customConfluenceSyncPages;
  });
