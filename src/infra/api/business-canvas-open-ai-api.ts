import type { BusinessCanvasApiModel } from '@/domain/models/output-models'
import type { CreateBusinessCanvasApiDto, CreateBusinessCanvasApi } from '@/interactions/contracts/api'
import OpenAI from 'openai'
import env from '@/main/configs/env'

export class BusinessCanvasOpenAiApi implements CreateBusinessCanvasApi {
  async create (dto: CreateBusinessCanvasApiDto): Promise<BusinessCanvasApiModel> {
    const openAi = new OpenAI({ apiKey: env.openAiApiKey })
    const result = await openAi.chat.completions.create({
      messages: [{ role: 'user', content: dto.input }],
      model: 'gpt-3.5-turbo'
    })
    const businessCanvas = result.choices[0].message.content as string
    return JSON.parse(businessCanvas) as BusinessCanvasApiModel
  }
}
