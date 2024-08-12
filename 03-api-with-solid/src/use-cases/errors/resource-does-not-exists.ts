export class ResourceDoesNotExistsError extends Error {
  constructor() {
    super('Resource does not exists.');
  }
}
