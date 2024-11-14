export class InvalidDetailsTagMissingSummaryError extends Error {
  constructor() {
    super("Invalid details tag. The details tag must have a summary tag.");
  }
}
