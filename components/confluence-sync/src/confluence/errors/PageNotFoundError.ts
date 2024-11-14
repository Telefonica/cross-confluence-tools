export class PageNotFoundError extends Error {
  constructor(id: string, options?: ErrorOptions) {
    super(`Error getting page with id ${id}: ${options?.cause}`, options);
  }
}
