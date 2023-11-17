import type { UserAnswer } from '../../entities/answer/answer-dto'
import type { QuestionModel } from '../../models/db-models'
import { BusinessCanvasDataBuilder as sut } from './business-canvas-data-builder'

const makeFakeQuestionsModel = (): QuestionModel[] => ([{
  id: 'type_question_id',
  content: 'Qual o tipo do seu negócio?',
  alternatives: [{
    id: 'in_person_alternative_id',
    description: 'in_person',
    questionId: 'type_question_id'
  }, {
    id: 'online_alternative_id',
    description: 'online',
    questionId: 'type_question_id'
  }]
}, {
  id: 'location_question_id', content: 'Qual a localização ou público para o qual deseja trabalhar (Cidade, estado ou país)?'
}, {
  id: 'description_question_id', content: 'Descreva seu negócio:'
}])

const makeFakeUserAnswers = (): UserAnswer[] => ([
  { questionId: 'type_question_id', alternativeId: 'in_person_alternative_id' },
  { questionId: 'location_question_id', answer: 'location_answer' },
  { questionId: 'description_question_id', answer: 'description_answer' }
])

describe('BusinessCanvasDataBuilder', () => {
  it('Should return an BusinessCanvasDataBuilderRes formatted ', async () => {
    const result = sut.execute({
      userAnswers: makeFakeUserAnswers(), questions: makeFakeQuestionsModel()
    })
    expect(result).toEqual({
      typeOfBusiness: 'in_person',
      businessDescription: 'description_answer',
      locationOrTargetAudience: 'location_answer'
    })
  })

  it('Should return an BusinessCanvasDataBuilderRes formatted no location', async () => {
    const result = sut.execute({
      userAnswers: [
        { questionId: 'type_question_id', alternativeId: 'online_alternative_id' },
        { questionId: 'description_question_id', answer: 'description_answer' }
      ],
      questions: makeFakeQuestionsModel()
    })
    expect(result).toEqual({
      typeOfBusiness: 'online',
      businessDescription: 'description_answer'
    })
  })
})
