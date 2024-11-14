import path from "path";

const TEST_COMPONENT_PATH = path.resolve(__dirname, "..");

export function getFixtureFolder(fixtureFolder: string): string {
  return path.resolve(TEST_COMPONENT_PATH, "fixtures", fixtureFolder);
}

export function getBinaryPathFromFixtureFolder(): string {
  return "../../../../bin/markdown-confluence-sync.mjs";
}
