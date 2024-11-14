export class InvalidPathException extends Error {
  constructor(path: string, options?: ErrorOptions) {
    super(`Invalid file: ${path}`, options);
  }
}
