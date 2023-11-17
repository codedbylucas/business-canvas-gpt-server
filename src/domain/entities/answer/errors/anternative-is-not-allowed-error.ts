export class AlternativeIsNotAllowedError extends Error {
  constructor () {
    super("The answer to this question should not contain 'anternativeId' field")
    this.name = 'AlternativeIsNotAllowedError'
  }
}
