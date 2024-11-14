import { customDocusaurusToConfluence } from "@support/mocks/DocusaurusToConfluence";

import { run } from "@src/Cli";

describe("cli", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should export run function", () => {
    expect(run).toBeDefined();
  });

  it("should call DocusaurusToConfluence sync function", async () => {
    customDocusaurusToConfluence.sync.mockReturnValue(true);
    await run();

    await expect(customDocusaurusToConfluence.sync).toHaveBeenCalled();
  });
});
