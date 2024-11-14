export class CompoundError extends Error {
  public readonly errors: Error[];

  constructor(...errors: Error[]) {
    super(errors.map((error) => error.message).join("\n"));
    this.errors = errors;
  }
}
