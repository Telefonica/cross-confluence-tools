export class InvalidMarkdownFormatException extends Error {
  constructor(path: string, options?: ErrorOptions) {
    super(`Invalid markdown format: ${path}`, options);
  }
}
