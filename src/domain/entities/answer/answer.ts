import { AnswerAndAlternativeNotProvidedError, InvalidQuestionIdError, InvalidAnswerError, AnswerIsNotAllowedError, MixedAnswerError, AlternativeIsNotAllowedError, InvalidAlternativeIdError } from './errors'
import type { AnswerDto, CreateManyAnswersDto } from './answer-dto'
import type { AnswerRes, ManyAnswersRes, ValidateRes } from './answer-response'
import type { AnswerEntityModel } from './answer-entity-model'
import { right, left } from '@/shared/either'

export class Answer {
  private constructor (private readonly answer: AnswerEntityModel) {}

  static create (dto: AnswerDto): AnswerRes {
    const validateResult = this.validate(dto)
    if (validateResult.isLeft()) {
      return left(validateResult.value)
    }
    const answer: AnswerEntityModel = {
      questionId: dto.userAnswer.questionId,
      ...(dto.userAnswer.alternativeId && { alternativeId: dto.userAnswer.alternativeId }),
      ...(dto.userAnswer.answer && { answer: dto.userAnswer.answer })
    }
    return right(new Answer(answer))
  }

  private static validate (dto: AnswerDto): ValidateRes {
    const { userAnswer: { questionId, alternativeId, answer }, questions } = dto
    if (!alternativeId && !answer) {
      return left(new AnswerAndAlternativeNotProvidedError())
    }
    if (answer && alternativeId) {
      return left(new MixedAnswerError())
    }
    const question = questions.find(question => question.id === questionId)
    if (!question) {
      return left(new InvalidQuestionIdError(questionId))
    }
    if (question?.alternatives && answer) {
      return left(new AnswerIsNotAllowedError())
    }
    if (!question?.alternatives && alternativeId) {
      return left(new AlternativeIsNotAllowedError())
    }
    if (question.alternatives && alternativeId) {
      const alternative = question.alternatives.find(
        alternative => alternative.id === alternativeId
      )
      if (!alternative) {
        return left(new InvalidAlternativeIdError(alternativeId))
      }
    }
    if (!question.alternatives && answer) {
      if (answer.length < 3 || answer.length > 750) {
        return left(new InvalidAnswerError(answer))
      }
    }
    return right(null)
  }

  static createMany (dto: CreateManyAnswersDto): ManyAnswersRes {
    const { userAnswers, questions } = dto
    const answers: Answer[] = []
    for (const userAnswer of userAnswers) {
      const createResult = this.create({ userAnswer, questions })
      if (createResult.isLeft()) {
        return left(createResult.value)
      }
      answers.push(createResult.value)
    }
    return right(answers)
  }
}
