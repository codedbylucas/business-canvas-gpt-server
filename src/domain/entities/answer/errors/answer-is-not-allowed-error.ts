export class AnswerIsNotAllowedError extends Error {
  constructor () {
    super("The answer to this question should not contain 'answer' field")
    this.name = 'AnswerIsNotAllowedError'
  }
}
