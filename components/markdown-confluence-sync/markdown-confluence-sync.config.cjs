require("dotenv").config();

if (
  !process.env.CONFLUENCE_URL ||
  !process.env.CONFLUENCE_PAT ||
  !process.env.CONFLUENCE_SPACE_KEY ||
  !process.env.CONFLUENCE_ROOT_PAGE_ID
) {
  throw new Error(
    "Please provide all required environment variables: CONFLUENCE_URL, CONFLUENCE_PAT, CONFLUENCE_SPACE_KEY, CONFLUENCE_ROOT_PAGE_ID",
  );
}

module.exports = {
  mode: "flat",
  docsDir: ".",
  filesPattern: "*(README.md|CHANGELOG.md)",
  confluence: {
    url: process.env.CONFLUENCE_URL,
    personalAccessToken: process.env.CONFLUENCE_PAT,
    spaceKey: process.env.CONFLUENCE_SPACE_KEY,
    rootPageId: process.env.CONFLUENCE_ROOT_PAGE_ID,
    rootPageName: "Cross",
  },
};
