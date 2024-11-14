export class UnexpectedError extends Error {
  constructor(error: unknown) {
    super(`Unexpected Error: ${error}`);
  }
}
