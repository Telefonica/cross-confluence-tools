// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import type {
  ConfigInterface,
  ConfigNamespaceInterface,
} from "@mocks-server/config";
import { Config } from "@mocks-server/config";
import type { LoggerInterface } from "@mocks-server/logger";
import { Logger } from "@mocks-server/logger";
import type { SyncModes } from "@tid-cross/confluence-sync";

import { DocusaurusPagesFactory } from "@src/lib/docusaurus/DocusaurusPagesFactory";
import type { DocusaurusPagesFactoryOptions } from "@src/lib/docusaurus/DocusaurusPagesFactory.types";

describe("docusaurusPagesFactory", () => {
  let config: ConfigInterface;
  let namespace: ConfigNamespaceInterface;
  let logger: LoggerInterface;
  let docusaurusPagesOptions: DocusaurusPagesFactoryOptions;

  beforeEach(async () => {
    config = new Config({
      moduleName: "markdown-confluence-sync",
    });
    namespace = config.addNamespace("docusaurus");
    logger = new Logger("", { level: "silent" });
    // @ts-expect-error Ignore to check different value for mode option
    docusaurusPagesOptions = { config: namespace, logger };
  });

  it(`should throw error with text "must be one of "tree" or "flat"" when docusaurus mode isn't valid mode`, async () => {
    await expect(async () =>
      DocusaurusPagesFactory.fromMode(
        "foo" as SyncModes,
        docusaurusPagesOptions,
      ),
    ).rejects.toThrow(
      expect.objectContaining({
        message: expect.stringContaining(`must be one of "tree" or "flat"`),
      }),
    );
  });
});
