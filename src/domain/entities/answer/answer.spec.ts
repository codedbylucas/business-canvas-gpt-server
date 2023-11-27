import { AlternativeIsNotAllowedError, AnswerAndAlternativeNotProvidedError, AnswerIsNotAllowedError, InvalidAlternativeIdError, InvalidAnswerError, InvalidQuestionIdError } from './errors'
import type { QuestionModel } from '@/domain/models/db-models'
import type { UserAnswer } from './answer-dto'
import { Answer, Answer as sut } from './answer'
import { MixedAnswerError } from './errors/mixed-answer-error'
import { left } from '@/shared/either'

const makeFakeQuestionsModel = (): QuestionModel[] => ([{
  id: 'any_question_id',
  content: 'any_content',
  type: 'text-area',
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
  id: 'other_question_id', content: 'other_content', type: 'text'
}])

const makeFakeUserAnswers = (): UserAnswer[] => ([
  { questionId: 'any_question_id', alternativeId: 'other_alternative_id' },
  { questionId: 'other_question_id', answer: 'any_answer' }
])

describe('Answer Entity', () => {
  describe('create()', () => {
    it('Should return AnswerAndAlternativeNotProvidedError if answer and a alternativeId not provided', () => {
      const result = sut.create({
        userAnswer: { questionId: 'any_question_id' },
        questions: makeFakeQuestionsModel()
      })
      expect(result.value).toEqual(new AnswerAndAlternativeNotProvidedError())
    })

    it('Should return MixedAnswerError if answer and a alternativeId is provided', () => {
      const result = sut.create({
        userAnswer: {
          questionId: 'any_question_id',
          alternativeId: 'invalid_alternative_id',
          answer: 'invalid_answer'
        },
        questions: makeFakeQuestionsModel()
      })
      expect(result.value).toEqual(new MixedAnswerError())
    })

    it('Should return InvalidQuestionIdError if user answer questionId is invalid', () => {
      const result = sut.create({
        userAnswer: { questionId: 'invalid_question_id', answer: 'any_answer' },
        questions: makeFakeQuestionsModel()
      })
      expect(result.value).toEqual(new InvalidQuestionIdError('invalid_question_id'))
    })

    it('Should return AnswerIsNotAllowedError if the answer field is sent for a question that does not require it', () => {
      const result = sut.create({
        userAnswer: { questionId: 'any_question_id', answer: 'any_answer' },
        questions: makeFakeQuestionsModel()
      })
      expect(result.value).toEqual(new AnswerIsNotAllowedError())
    })

    it('Should return AlternativeIsNotAllowedError if the alternativeId field is sent for a question that does not require it', () => {
      const result = sut.create({
        userAnswer: { questionId: 'other_question_id', alternativeId: 'any_alternative_id' },
        questions: makeFakeQuestionsModel()
      })
      expect(result.value).toEqual(new AlternativeIsNotAllowedError())
    })

    it('Should return InvalidAlternativeIdError if user answer alternativeId is invalid', () => {
      const result = sut.create({
        userAnswer: { questionId: 'any_question_id', alternativeId: 'invalid_alternative_id' },
        questions: makeFakeQuestionsModel()
      })
      expect(result.value).toEqual(new InvalidAlternativeIdError('invalid_alternative_id'))
    })

    it('Should return InvalidAnswerError if answer is less than 3 characters', () => {
      const result = sut.create({
        userAnswer: { questionId: 'other_question_id', answer: 'ab' },
        questions: makeFakeQuestionsModel()
      })
      expect(result.value).toEqual(new InvalidAnswerError('ab'))
    })

    it('Should return InvalidAnswerError if answer greater than 750 characters', () => {
      const answer = 'a'.repeat(751)
      const result = sut.create({
        userAnswer: { questionId: 'other_question_id', answer },
        questions: makeFakeQuestionsModel()
      })
      expect(result.value).toEqual(new InvalidAnswerError(answer))
    })

    it('Should return a new Answer with answer alternativeId if validations is a success', () => {
      const result = sut.create({
        userAnswer: { questionId: 'any_question_id', alternativeId: 'any_alternative_id' },
        questions: makeFakeQuestionsModel()
      })
      expect(result.value).toEqual({
        answer: {
          questionId: 'any_question_id',
          alternativeId: 'any_alternative_id'
        }
      })
    })

    it('Should return a new Answer with answer field if validations is a success', () => {
      const result = sut.create({
        userAnswer: { questionId: 'other_question_id', answer: 'any_answer' },
        questions: makeFakeQuestionsModel()
      })
      expect(result.value).toEqual({
        answer: {
          questionId: 'other_question_id',
          answer: 'any_answer'
        }
      })
    })
  })

  describe('createMany()', () => {
    it('Should call create method with all user answers', () => {
      const createSpy = jest.spyOn(Answer, 'create')
      Answer.createMany({
        userAnswers: makeFakeUserAnswers(),
        questions: makeFakeQuestionsModel()
      })
      expect(createSpy).toHaveBeenCalledWith({
        userAnswer: makeFakeUserAnswers()[0], questions: makeFakeQuestionsModel()
      })
      expect(createSpy).toHaveBeenCalledWith({
        userAnswer: makeFakeUserAnswers()[1], questions: makeFakeQuestionsModel()
      })
    })

    it('Should call create method twice', () => {
      const createSpy = jest.spyOn(Answer, 'create')
      Answer.createMany({
        userAnswers: makeFakeUserAnswers(),
        questions: makeFakeQuestionsModel()
      })
      expect(createSpy).toHaveBeenCalledTimes(2)
    })

    it('Should return an errro if create method returns any error', () => {
      jest.spyOn(Answer, 'create').mockReturnValueOnce(
        left(new Error('any_message'))
      )
      const result = Answer.createMany({
        userAnswers: makeFakeUserAnswers(),
        questions: makeFakeQuestionsModel()
      })
      expect(result.value).toEqual(new Error('any_message'))
    })

    it('Should return many new Answer if validations is a success', () => {
      const result = Answer.createMany({
        userAnswers: makeFakeUserAnswers(),
        questions: makeFakeQuestionsModel()
      })
      expect(result.value).toEqual([{
        answer: {
          questionId: 'any_question_id',
          alternativeId: 'other_alternative_id'
        }
      }, {
        answer: {
          questionId: 'other_question_id',
          answer: 'any_answer'
        }
      }])
    })
  })
})
