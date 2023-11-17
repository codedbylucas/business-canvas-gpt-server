export class InvalidQuestionIdError extends Error {
  constructor (questionId: string) {
    super(`The question with ID: '${questionId}' is invalid`)
    this.name = 'InvalidQuestionIdError'
  }
}
