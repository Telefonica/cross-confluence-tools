export class PathNotExistException extends Error {
  constructor(path: string, options?: ErrorOptions) {
    super(`Path not exist: ${path}`, options);
  }
}
