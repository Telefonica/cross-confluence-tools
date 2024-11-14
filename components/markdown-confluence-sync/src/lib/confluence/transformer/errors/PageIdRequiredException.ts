export class PageIdRequiredException extends Error {
  constructor() {
    super(
      "Confluence root page id is required for FLAT synchronization mode when there are pages without an id. Set the confluence.rootPageId option or add an id for all pages.",
    );
  }
}
