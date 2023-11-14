import type { QuestionModel } from '@/domain/models/db-models'
import { Answer as sut } from './answer'
import { AnswerAndAlternativeNotProvidedError } from './errors'

const makeFakeQuestionsModel = (): QuestionModel[] => ([{
  id: 'any_question_id',
  content: 'any_content',
  alternatives: [{
    id: 'any_alternative_id',
    description: 'any_alternative',
    questionId: 'any_question_id'
  }, {
    id: 'other_alternative_id',
    description: 'other_alternative',
    questionId: 'any_question_id'
  }]
}, {
  id: 'other_question_id', content: 'other_content'
}])

describe('Answer Entity', () => {
  it('Should return AnswerAndAlternativeNotProvidedError if answer and a alternativeId not provided', () => {
    const result = sut.create({
      userAnswer: { questionId: 'any_question_id' },
      questions: makeFakeQuestionsModel()
    })
    expect(result.value).toEqual(new AnswerAndAlternativeNotProvidedError())
  })
})
