export class QuestionsNotFoundError extends Error {
  constructor () {
    super('Questions not found')
    this.name = 'QuestionsNotFoundError'
  }
}
