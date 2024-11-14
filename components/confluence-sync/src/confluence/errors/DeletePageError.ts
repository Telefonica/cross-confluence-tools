export class DeletePageError extends Error {
  constructor(id: string, options?: ErrorOptions) {
    super(`Error deleting content with id ${id}: ${options?.cause}`, options);
  }
}
