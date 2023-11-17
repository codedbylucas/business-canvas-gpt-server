import { QuestionRedisCache } from '@/infra/cache/redis/question-redis-cache'

export const questionRedisCacheFactory = (): QuestionRedisCache => {
  return new QuestionRedisCache()
}
