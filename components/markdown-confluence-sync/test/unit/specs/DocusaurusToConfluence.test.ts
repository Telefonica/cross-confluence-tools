import { customConfluenceSync } from "@support/mocks/ConfluenceSync";
import { customDocusaurusPages } from "@support/mocks/DocusaurusPages";

import { DocusaurusToConfluence } from "@src/lib";

const CONFIG = {
  config: {
    readArguments: false,
    readFile: false,
    readEnvironment: false,
  },
};

describe("docusaurusToConfluence", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(DocusaurusToConfluence).toBeDefined();
  });

  it("should fail if not pass the configuration", async () => {
    // Assert
    //@ts-expect-error Ignore the next line to don't pass configuration
    expect(() => new DocusaurusToConfluence()).toThrow(
      "Please provide configuration",
    );
  });

  it("when called twice, it should send to synchronize the pages to confluence twice", async () => {
    // Arrange
    const docusaurusToConfluence = new DocusaurusToConfluence(CONFIG);
    customDocusaurusPages.read.mockResolvedValue([]);

    // Act
    await docusaurusToConfluence.sync();
    await docusaurusToConfluence.sync();

    // Assert
    expect(customConfluenceSync.sync.mock.calls).toHaveLength(2);
  });
});
