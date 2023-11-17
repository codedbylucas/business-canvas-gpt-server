import type { AnswerAndAlternativeNotProvidedError, InvalidQuestionIdError, InvalidAnswerError, AnswerIsNotAllowedError, MixedAnswerError, AlternativeIsNotAllowedError, InvalidAlternativeIdError } from './errors'
import type { Either } from '@/shared/either'
import type { Answer } from './answer'

export type AnswerErrors =
InvalidQuestionIdError |
AnswerAndAlternativeNotProvidedError |
InvalidAnswerError |
AnswerIsNotAllowedError |
MixedAnswerError |
AlternativeIsNotAllowedError |
InvalidAlternativeIdError

export type AnswerRes = Either<AnswerErrors, Answer>

export type ManyAnswersRes = Either<AnswerErrors, Answer[]>

export type ValidateRes = Either<AnswerErrors, null>
