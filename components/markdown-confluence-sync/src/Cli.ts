import { DocusaurusToConfluence } from "./lib/index.js";

export async function run() {
  const docusaurusToConfluence = new DocusaurusToConfluence({
    config: {
      readArguments: true,
      readEnvironment: true,
      readFile: true,
    },
  });
  await docusaurusToConfluence.sync();
}
