import type { UserAnswer } from '../../entities/answer/answer-dto'
import type { QuestionModel } from '../../models/db-models'

export interface BusinessCanvasDataBuilderDto {
  userAnswers: UserAnswer[]
  questions: QuestionModel[]
}

export interface BusinessCanvasDataBuilderRes {
  typeOfBusiness: string
  businessDescription: string
  locationOrTargetAudience?: string
}

export class BusinessCanvasDataBuilder {
  static execute (dto: BusinessCanvasDataBuilderDto): BusinessCanvasDataBuilderRes {
    const { userAnswers, questions } = dto
    const object = { businessDescription: '', typeOfBusiness: '', locationOrTargetAudience: '' }
    for (const userAnswer of userAnswers) {
      const question = questions.find(question => question.id === userAnswer.questionId) as QuestionModel
      if (this.regexLocation().test(question.content)) {
        object.locationOrTargetAudience = userAnswer.answer as string
      }
      if (this.regexBusinessType().test(question.content)) {
        const alternative = question.alternatives?.find(alternative => alternative.id === userAnswer.alternativeId)
        object.typeOfBusiness = alternative?.description as string
      }
      if (this.regexDescription().test(question.content)) {
        object.businessDescription = userAnswer.answer as string
      }
    }
    return {
      businessDescription: object.businessDescription,
      typeOfBusiness: object.typeOfBusiness,
      ...(object.locationOrTargetAudience?.length > 0 && { locationOrTargetAudience: object.locationOrTargetAudience })
    }
  }

  private static regexLocation (): RegExp {
    const keysWords = ['localização', 'público', 'local', 'cidade', 'estado', 'trabalhar']
    return new RegExp(keysWords.join('|'), 'gi')
  }

  private static regexBusinessType (): RegExp {
    const keysWords = ['tipo do seu negócio', 'tipo do negócio', 'tipo']
    return new RegExp(keysWords.join('|'), 'gi')
  }

  private static regexDescription (): RegExp {
    const keysWords = ['descreva', 'descrição']
    return new RegExp(keysWords.join('|'), 'gi')
  }
}
