import { Alternative } from '../alternative/alternative'
import type { QuestionEntityModel } from './question-entity-model'

export class Question {
  private static readonly values: QuestionEntityModel[] = []

  private constructor (private readonly question: QuestionEntityModel) {
    Question.values.push(this.question)
    Object.freeze(this)
  }

  static getQuestion (data: Question): undefined | QuestionEntityModel {
    return Question.values.find(question => question === data.question)
  }

  private static create (data: QuestionEntityModel): Question {
    return new Question(data)
  }

  static createMany (): Question[] {
    const content = 'Qual a localização ou público para o qual deseja trabalhar (Cidade, estado ou país)?'
    const content2 = 'Descreva seu negócio:'
    const questions = [
      this.create({ content, type: 'text' }),
      this.create({ content: content2, type: 'text-area' })
    ]
    const alternatives: Alternative[] = [
      Alternative.create('Presencial'), Alternative.create('Online')
    ]
    const question = this.create({
      content: 'Qual o tipo do seu negócio?', alternatives, type: 'select'
    })
    return [question, ...questions]
  }
}
