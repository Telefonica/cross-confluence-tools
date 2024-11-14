export class InvalidTabsFormatError extends Error {
  constructor() {
    super("Invalid Tabs tag. The Tabs tag must have only TabItem children.");
  }
}
