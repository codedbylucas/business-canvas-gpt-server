import type { QuestionModel } from '@/domain/models/db-models'
import type { AddManyQuestionsRepo, FetchAllQuestionsRepo } from '@/interactions/contracts/db'
import { RedisHelper } from './helpers/redis-helper'

export class QuestionRedisCache implements FetchAllQuestionsRepo, AddManyQuestionsRepo {
  async fetchAll (): Promise<QuestionModel[]> {
    const redis = RedisHelper.getInstance()
    const questionsJson = await redis.get('questions')
    if (!questionsJson) {
      return []
    }
    const questions: QuestionModel[] = JSON.parse(questionsJson)
    return questions
  }

  async addMany (data: QuestionModel[]): Promise<void> {
    const redis = RedisHelper.getInstance()
    await redis.set('questions', JSON.stringify(data))
  }
}
