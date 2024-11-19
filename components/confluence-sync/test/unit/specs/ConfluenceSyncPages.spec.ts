// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import { readFile } from "node:fs/promises";

import type { FileResult } from "tmp";

import {
  convertPagesAncestorsToConfluenceAncestors,
  createChildPage,
  createConfluencePage,
  createInputPage,
  createInputTree,
  createTree,
} from "@support/fixtures/Pages";
import { customClient } from "@support/mocks/CustomConfluenceClient";
import { TempFiles } from "@support/utils/TempFiles";
const { fileSync } = new TempFiles();

import type {
  ConfluencePage,
  ConfluencePageBasicInfo,
} from "@src/confluence/CustomConfluenceClient.types";
import { ConfluenceSyncPages } from "@src/ConfluenceSyncPages";
import {
  SyncModes,
  type ConfluenceInputPage,
  type ConfluencePagesDictionaryItem,
  type ConfluenceSyncPagesInterface,
} from "@src/ConfluenceSyncPages.types";

import { CompoundError } from "../../../src/errors/CompoundError";
import { cleanLogs } from "../support/Logs";

describe("confluenceSyncPages", () => {
  let confluenceSynchronizer: ConfluenceSyncPagesInterface;
  let confluenceTree: ConfluencePage[];
  let pages: ConfluenceInputPage[];
  let rootPage: ConfluencePage;
  let rootPageAsAncestor: ConfluencePageBasicInfo;
  let dictionary: Record<string, ConfluencePagesDictionaryItem>;
  let tempFile: FileResult;
  let tempFile2: FileResult;
  let file1: Promise<Buffer>;
  let file2: Promise<Buffer>;

  beforeEach(() => {
    confluenceSynchronizer = new ConfluenceSyncPages({
      personalAccessToken: "foo-token",
      spaceId: "foo-space-id",
      rootPageId: "foo-root-id",
      url: "foo-url",
    });

    confluenceTree = createTree();
    pages = createInputTree();
    rootPage = createConfluencePage({
      name: "root",
      children: [{ id: confluenceTree[0].id, title: confluenceTree[0].title }],
    });
    rootPageAsAncestor = { id: rootPage.id, title: rootPage.title };
    confluenceTree.forEach((page) => {
      if (page.ancestors) {
        page.ancestors.unshift({ id: rootPage.id, title: rootPage.title });
      } else {
        page.ancestors = [{ id: rootPage.id, title: rootPage.title }];
      }
    });
    pages.forEach((page) => {
      if (page.ancestors) {
        page.ancestors.unshift(rootPage.title);
      } else {
        page.ancestors = [rootPage.title];
      }
    });
    dictionary = {};
    dictionary[rootPage.id] = rootPage;
    confluenceTree.forEach((page) => {
      dictionary[page.id] = page;
    });

    customClient.getPage.mockImplementation((id) => {
      return dictionary[id];
    });
    customClient.createPage.mockImplementation((page) => {
      return Promise.resolve({
        id: `foo-${page.title}-id`,
        title: page.title,
        version: 1,
        content: page.content,
        children: [],
        ancestors: page.ancestors,
      });
    });
    customClient.getAttachments.mockImplementation(() => []);
    tempFile = fileSync();
    tempFile2 = fileSync();
    file1 = readFile(tempFile.name);
    file2 = readFile(tempFile2.name);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("sync method", () => {
    describe("when root page has children", () => {
      it("should call confluence client to get the root page and all its children to create the tree", async () => {
        await confluenceSynchronizer.sync(pages);

        expect(customClient.getPage).toHaveBeenCalledTimes(8);
        expect(customClient.getPage).toHaveBeenCalledWith("foo-root-id");
        expect(customClient.getPage).toHaveBeenCalledWith("foo-parent-id");
        expect(customClient.getPage).toHaveBeenCalledWith("foo-child1-id");
        expect(customClient.getPage).toHaveBeenCalledWith("foo-child2-id");
        expect(customClient.getPage).toHaveBeenCalledWith("foo-grandChild1-id");
        expect(customClient.getPage).toHaveBeenCalledWith("foo-grandChild2-id");
        expect(customClient.getPage).toHaveBeenCalledWith("foo-grandChild3-id");
        expect(customClient.getPage).toHaveBeenCalledWith("foo-grandChild4-id");
      });

      it("should call confluence client to create the pages that are in input pages but are not in the tree", async () => {
        const createdChild1 = createChildPage(pages[2], "createdChild1");
        const createdChild2 = createChildPage(pages[3], "createdChild2");
        await confluenceSynchronizer.sync([
          ...pages,
          createdChild1,
          createdChild2,
        ]);

        expect(customClient.createPage).toHaveBeenCalledTimes(2);
        expect(customClient.createPage).toHaveBeenCalledWith({
          ...createdChild1,
          ancestors: [
            rootPageAsAncestor,
            ...convertPagesAncestorsToConfluenceAncestors(
              pages[2],
              confluenceTree,
            ),
            { id: confluenceTree[2].id, title: confluenceTree[2].title },
          ],
        });
        expect(customClient.createPage).toHaveBeenCalledWith({
          ...createdChild2,
          ancestors: [
            rootPageAsAncestor,
            ...convertPagesAncestorsToConfluenceAncestors(
              pages[3],
              confluenceTree,
            ),
            { id: confluenceTree[3].id, title: confluenceTree[3].title },
          ],
        });
      });

      it("should call confluence client to update the pages that are in the tree and are in input pages", async () => {
        await confluenceSynchronizer.sync(pages);

        expect(customClient.updatePage).toHaveBeenCalledTimes(7);
        expect(customClient.updatePage).toHaveBeenCalledWith({
          id: confluenceTree[0].id,
          version: confluenceTree[0].version + 1,
          ...pages[0],
          ancestors: confluenceTree[0].ancestors,
        });
        expect(customClient.updatePage).toHaveBeenCalledWith({
          id: confluenceTree[1].id,
          version: confluenceTree[1].version + 1,
          ...pages[1],
          ancestors: confluenceTree[1].ancestors,
        });
        expect(customClient.updatePage).toHaveBeenCalledWith({
          id: confluenceTree[2].id,
          version: confluenceTree[2].version + 1,
          ...pages[2],
          ancestors: confluenceTree[2].ancestors,
        });
        expect(customClient.updatePage).toHaveBeenCalledWith({
          id: confluenceTree[3].id,
          version: confluenceTree[3].version + 1,
          ...pages[3],
          ancestors: confluenceTree[3].ancestors,
        });
        expect(customClient.updatePage).toHaveBeenCalledWith({
          id: confluenceTree[4].id,
          version: confluenceTree[4].version + 1,
          ...pages[4],
          ancestors: confluenceTree[4].ancestors,
        });
        expect(customClient.updatePage).toHaveBeenCalledWith({
          id: confluenceTree[5].id,
          version: confluenceTree[5].version + 1,
          ...pages[5],
          ancestors: confluenceTree[5].ancestors,
        });
        expect(customClient.updatePage).toHaveBeenCalledWith({
          id: confluenceTree[6].id,
          version: confluenceTree[6].version + 1,
          ...pages[6],
          ancestors: confluenceTree[6].ancestors,
        });
      });

      it("should call confluence client to delete the pages that are not in input pages but are in the tree", async () => {
        const pagesSlice = pages.slice(0, 5);
        await confluenceSynchronizer.sync(pagesSlice);

        expect(customClient.deleteContent).toHaveBeenCalledTimes(2);
        expect(customClient.deleteContent).toHaveBeenCalledWith(
          confluenceTree[5].id,
        );
        expect(customClient.deleteContent).toHaveBeenCalledWith(
          confluenceTree[6].id,
        );
      });

      describe("when there are pages to create that have attachments", () => {
        it("should call confluence client to create the pages and its attachments", async () => {
          const tempAttachments = {} as Record<string, string>;
          tempAttachments["tempFile"] = tempFile.name;
          tempAttachments["tempFile2"] = tempFile2.name;
          const files = [await file1, await file2];
          const createdPage = {
            ...createChildPage(pages[0], "createdPage"),
            attachments: tempAttachments,
          };
          await confluenceSynchronizer.sync([...pages, createdPage]);

          expect(customClient.createPage).toHaveBeenCalledTimes(1);
          expect(customClient.createPage).toHaveBeenCalledWith({
            ...createdPage,
            ancestors: [
              rootPageAsAncestor,
              { id: confluenceTree[0].id, title: confluenceTree[0].title },
            ],
          });
          expect(customClient.createAttachments).toHaveBeenCalledTimes(1);
          expect(customClient.createAttachments).toHaveBeenCalledWith(
            `foo-${createdPage.title}-id`,
            Object.entries(
              createdPage.attachments as Record<string, string>,
            ).map((attachment, i) => ({
              filename: attachment[0],
              file: files[i],
            })),
          );
        });
      });

      describe("when there are pages to update that have attachments", () => {
        describe("when the confluence page has attachments too", () => {
          let attachments: ConfluencePageBasicInfo[];

          beforeEach(() => {
            customClient.getAttachments.mockImplementation((id) => {
              attachments = [
                { id: "foo-attachment-id", title: "foo-attachment-title" },
                { id: "foo-attachment-id-2", title: "foo-attachment-title-2" },
              ];
              if (id === confluenceTree[0].id) {
                return attachments;
              } else return [];
            });
          });

          it("should call confluence client to delete the attachments and create the new ones", async () => {
            const tempAttachments = {} as Record<string, string>;
            tempAttachments["tempFile"] = tempFile.name;
            tempAttachments["tempFile2"] = tempFile2.name;
            const files = [await file1, await file2];
            const updatedPage = { ...pages[0], attachments: tempAttachments };
            await confluenceSynchronizer.sync([...pages.slice(1), updatedPage]);

            expect(customClient.deleteContent).toHaveBeenCalledWith(
              attachments[0].id,
            );
            expect(customClient.deleteContent).toHaveBeenCalledWith(
              attachments[1].id,
            );
            expect(customClient.createAttachments).toHaveBeenCalledWith(
              confluenceTree[0].id,
              Object.entries(
                updatedPage.attachments as Record<string, string>,
              ).map((attachment, i) => ({
                filename: attachment[0],
                file: files[i],
              })),
            );
          });
        });
      });

      describe("when there are pages that are not in the tree and have children", () => {
        it("should end up creating the pages and its children", async () => {
          const createdPageParent = createChildPage(
            pages[0],
            "createdPageParent",
          );
          const createdPageChild = createChildPage(
            createdPageParent,
            "createdPageChild",
          );
          await confluenceSynchronizer.sync([
            ...pages,
            createdPageParent,
            createdPageChild,
          ]);

          expect(customClient.createPage).toHaveBeenCalledTimes(2);
          expect(customClient.createPage).toHaveBeenCalledWith({
            ...createdPageParent,
            ancestors: [
              rootPageAsAncestor,
              { id: confluenceTree[0].id, title: confluenceTree[0].title },
            ],
          });
          expect(customClient.createPage).toHaveBeenCalledWith({
            ...createdPageChild,
            ancestors: [
              rootPageAsAncestor,
              { id: confluenceTree[0].id, title: confluenceTree[0].title },
              {
                id: `foo-${createdPageParent.title}-id`,
                title: createdPageParent.title,
              },
            ],
          });
        });

        describe("when one of the page to create returns an error", () => {
          beforeEach(() => {
            customClient.createPage.mockImplementation((page) => {
              if (page.title === "foo-wrongPage-title")
                return Promise.reject(new Error("error"));
              else {
                return Promise.resolve({
                  id: `foo-${page.title}-id`,
                  title: page.title,
                  version: 1,
                  content: page.content,
                  children: [],
                  ancestors: page.ancestors,
                });
              }
            });
          });

          it("should create the other pages and throw an error", async () => {
            const createdPageParent = createChildPage(
              pages[0],
              "createdPageParent",
            );
            const createdPageChild = createChildPage(
              createdPageParent,
              "createdPageChild",
            );
            const wrongPage = createChildPage(pages[0], "wrongPage");

            await expect(
              confluenceSynchronizer.sync([
                ...pages,
                createdPageParent,
                createdPageChild,
                wrongPage,
              ]),
            ).rejects.toThrow(CompoundError);

            expect(customClient.createPage).toHaveBeenCalledTimes(3);
            expect(customClient.createPage).toHaveBeenCalledWith({
              ...createdPageParent,
              ancestors: [
                rootPageAsAncestor,
                { id: confluenceTree[0].id, title: confluenceTree[0].title },
              ],
            });
            expect(customClient.createPage).toHaveBeenCalledWith({
              ...createdPageChild,
              ancestors: [
                rootPageAsAncestor,
                { id: confluenceTree[0].id, title: confluenceTree[0].title },
                {
                  id: `foo-${createdPageParent.title}-id`,
                  title: createdPageParent.title,
                },
              ],
            });
          });
        });
      });

      describe("when there are pages that are not in the tree whose parent is not in the tree or in the input pages either", () => {
        let missingPage: ConfluenceInputPage;
        let wrongPage1: ConfluenceInputPage;
        let wrongPage2: ConfluenceInputPage;
        let wrongInputPages: ConfluenceInputPage[];

        beforeEach(() => {
          missingPage = createChildPage(pages[0], "missingPage");
          wrongPage1 = createChildPage(missingPage, "wrongPage1");
          wrongPage2 = createChildPage(wrongPage1, "wrongPage2");
          wrongInputPages = [...pages, wrongPage1, wrongPage2];
        });

        it("should throw an error because it is not possible to create the page", async () => {
          await expect(
            confluenceSynchronizer.sync(wrongInputPages),
          ).rejects.toThrow(
            `There still are 2 pages to create after sync: ${wrongPage1.title}, ${wrongPage2.title}, check if they have their ancestors created.`,
          );
        });

        it("should log the pages that are not possible to create", async () => {
          confluenceSynchronizer.logger.setLevel("error", {
            transport: "store",
          });
          try {
            await confluenceSynchronizer.sync(wrongInputPages);
          } catch {
            // do nothing
          }

          expect(cleanLogs(confluenceSynchronizer.logger.store)).toEqual(
            expect.arrayContaining([
              expect.stringContaining(
                `There still are 2 pages to create after sync: ${wrongPage1.title}, ${wrongPage2.title}, check if they have their ancestors created.`,
              ),
            ]),
          );
        });
      });
    });

    describe("when input pages has no ancestors", () => {
      it("should add root ancestor by default and create that pages under root page", async () => {
        const pageWithoutAncestor1 = createInputPage({
          name: "pageWithoutAncestors1",
        });
        const pageWithoutAncestor2 = createInputPage({
          name: "pageWithoutAncestors2",
        });
        await confluenceSynchronizer.sync([
          pageWithoutAncestor1,
          pageWithoutAncestor2,
        ]);

        expect(customClient.createPage).toHaveBeenCalledTimes(2);
        expect(customClient.createPage).toHaveBeenCalledWith({
          ...pageWithoutAncestor1,
          ancestors: [rootPageAsAncestor],
        });
        expect(customClient.createPage).toHaveBeenCalledWith({
          ...pageWithoutAncestor2,
          ancestors: [rootPageAsAncestor],
        });
      });
    });

    describe("when root page children as undefined", () => {
      beforeEach(() => {
        customClient.getPage.mockImplementation((id) => {
          if (id === rootPage.id) {
            return {
              ...rootPage,
              children: undefined,
            };
          } else {
            return dictionary[id];
          }
        });
      });

      it("should call only once to getPage", async () => {
        const pageToBeCreated = createInputPage({ name: "pageToBeCreated" });
        await confluenceSynchronizer.sync([pageToBeCreated]);

        expect(customClient.getPage.mock.calls[0][0]).toEqual(rootPage.id);
        expect(customClient.getPage).toHaveBeenCalledTimes(1);
      });
    });

    it("should have silent log level by default", async () => {
      const confluenceSynchronizer2 = new ConfluenceSyncPages({
        personalAccessToken: "foo-token",
        spaceId: "foo-space-id",
        rootPageId: "foo-root-id",
        url: "foo-url",
      });
      await confluenceSynchronizer2.sync([]);

      expect(confluenceSynchronizer2.logger.store).toHaveLength(0);
    });

    describe("when flat mode is enabled and root page is not provided", () => {
      let pagesToUpdate: ConfluenceInputPage[];

      beforeEach(() => {
        confluenceSynchronizer = new ConfluenceSyncPages({
          personalAccessToken: "foo-token",
          spaceId: "foo-space-id",
          syncMode: SyncModes.FLAT,
          url: "foo-url",
        });
        pagesToUpdate = [
          createInputPage({ name: "pageToUpdate" }),
          createInputPage({ name: "pageToUpdate2" }),
          createInputPage({ name: "pageToUpdate3" }),
          createInputPage({ name: "pageToUpdate4" }),
        ].map((page, i) => ({ ...page, id: `foo-page${i}-id` }));
        const pageMap = Object.fromEntries(
          pagesToUpdate.map((page) => [page.id, { ...page, version: 1 }]),
        );
        customClient.getPage.mockImplementation((id) => {
          if (id === "foo-inexistent-id") {
            throw new Error(`No content found with id ${id}`);
          } else {
            return pageMap[id];
          }
        });
      });

      it("should update the pages passed as input", async () => {
        await confluenceSynchronizer.sync(pagesToUpdate);

        expect(customClient.updatePage).toHaveBeenCalledTimes(4);
        expect(customClient.updatePage).toHaveBeenCalledWith({
          ...pagesToUpdate[0],
          version: 2,
        });
      });

      it("should fail if any of the pages has no id", async () => {
        const wrongPage = createInputPage({ name: "wrongPage" });

        await expect(
          confluenceSynchronizer.sync([...pagesToUpdate, wrongPage]),
        ).rejects.toThrow(
          `rootPageId is required for FLAT sync mode when there are pages without id: ${wrongPage.title}`,
        );
      });

      it("should fail if any of the pages does not exist in confluence but still try to update the rest", async () => {
        const inexistentPage = {
          ...createInputPage({ name: "inexistentPage" }),
          id: "foo-inexistent-id",
        };

        await expect(
          confluenceSynchronizer.sync([...pagesToUpdate, inexistentPage]),
        ).rejects.toThrow(`No content found with id ${inexistentPage.id}`);
        expect(customClient.updatePage).toHaveBeenCalledTimes(4);
      });
    });

    describe("when flat mode is enabled and root page is provided", () => {
      let pagesToSync: ConfluenceInputPage[];
      let pagesToCreate: ConfluenceInputPage[];
      let pagesToUpdateWithId: ConfluenceInputPage[];
      let pageToUpdateInAlreadyTree: ConfluenceInputPage[];

      beforeEach(() => {
        confluenceSynchronizer = new ConfluenceSyncPages({
          personalAccessToken: "foo-token",
          spaceId: "foo-space-id",
          rootPageId: "foo-root-id",
          syncMode: SyncModes.FLAT,
          url: "foo-url",
        });
        pagesToCreate = [createInputPage({ name: "pageToCreate" })];
        pagesToUpdateWithId = [
          { id: "foo-page1-id", ...createInputPage({ name: "pageToUpdate1" }) },
          { id: "foo-page2-id", ...createInputPage({ name: "pageToUpdate2" }) },
        ];
        pageToUpdateInAlreadyTree = [
          createInputPage({ name: "pageToUpdateInTree" }),
        ];
        pagesToSync = [
          ...pagesToUpdateWithId,
          ...pagesToCreate,
          ...pageToUpdateInAlreadyTree,
        ];
        customClient.getPage.mockImplementation((id) => {
          const pageMap = Object.fromEntries(
            pagesToUpdateWithId.map((page) => [
              page.id,
              { ...page, version: 1 },
            ]),
          );
          pageMap[rootPage.id] = {
            ...rootPage,
            children: [
              pagesToUpdateWithId[0],
              {
                id: "foo-pageToDelete-id",
                title: "pageToDelete",
              },
              {
                ...pageToUpdateInAlreadyTree[0],
                id: "foo-pageToUpdateInTree-id",
              },
            ],
          };
          pageMap["foo-pageToDelete-id"] = {
            id: "foo-pageToDelete-id",
            title: "pageToDelete",
          };
          pageMap["foo-pageToUpdateInTree-id"] = {
            ...pageToUpdateInAlreadyTree[0],
            id: "foo-pageToUpdateInTree-id",
            version: 1,
          };

          return pageMap[id];
        });
      });

      it("should update the pages with id", async () => {
        await confluenceSynchronizer.sync(pagesToSync);

        expect(customClient.updatePage).toHaveBeenCalledWith({
          ...pagesToUpdateWithId[0],
          version: 2,
        });
        expect(customClient.updatePage).toHaveBeenCalledWith({
          ...pagesToUpdateWithId[1],
          version: 2,
        });
      });

      it("should create the pages without id, that are not under root page", async () => {
        await confluenceSynchronizer.sync(pagesToCreate);

        expect(customClient.createPage).toHaveBeenCalledTimes(1);
        expect(customClient.createPage).toHaveBeenCalledWith({
          ...pagesToCreate[0],
          ancestors: [rootPageAsAncestor],
        });
      });

      it("should delete the pages that are under root page but not in the input", async () => {
        await confluenceSynchronizer.sync(pagesToSync);

        expect(customClient.deleteContent).toHaveBeenCalledTimes(1);
        expect(customClient.deleteContent).toHaveBeenCalledWith(
          "foo-pageToDelete-id",
        );
      });

      it("should update the pages that are under root page and in the input", async () => {
        await confluenceSynchronizer.sync(pagesToSync);

        expect(customClient.updatePage).toHaveBeenCalledWith({
          id: "foo-pageToUpdateInTree-id",
          ...pageToUpdateInAlreadyTree[0],
          version: 2,
        });
      });

      it("should log a warning if any of the pages that are under root page and in the input has id", async () => {
        confluenceSynchronizer.logger.setLevel("warn");
        await confluenceSynchronizer.sync(pagesToSync);

        expect(cleanLogs(confluenceSynchronizer.logger.store)).toEqual(
          expect.arrayContaining([
            expect.stringContaining(
              `Some children of root page contains id: ${pagesToSync[0].title}`,
            ),
          ]),
        );
      });

      it("should fail if any of the pages without id has ancestors", async () => {
        const wrongPage = createInputPage({
          name: "wrongPage",
          ancestors: ["ancestor"],
        });

        await expect(
          confluenceSynchronizer.sync([...pagesToSync, wrongPage]),
        ).rejects.toThrow(
          `Pages with ancestors are not supported in FLAT sync mode: ${wrongPage.title}`,
        );
      });
    });

    describe("when sync mode is tree but rootPageId is not passed", () => {
      it("should throw an error", () => {
        expect(
          () =>
            new ConfluenceSyncPages({
              personalAccessToken: "foo-token",
              spaceId: "foo-space-id",
              syncMode: SyncModes.TREE,
              url: "foo-url",
            }),
        ).toThrow("rootPageId is required for TREE sync mode");
      });
    });
  });
});
