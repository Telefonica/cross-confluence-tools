export class InvalidTabItemMissingLabelError extends Error {
  constructor() {
    super("Invalid TabItem tag. The TabItem tag must have a label property.");
  }
}
