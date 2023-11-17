import type { BusinessCanvasApiModel } from '@/domain/models/output-models'
import { BusinessCanvasOpenAiApi } from './business-canvas-open-ai-api'
import OpenAI from 'openai'

jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockReturnValueOnce(
          Promise.resolve({
            choices: [{
              message: {
                content: JSON.stringify(makeFakeBusinessCanvasApiModel())
              }
            }]
          })
        )
      }
    }
  }))
}))

const makeFakeBusinessCanvasApiModel = (): BusinessCanvasApiModel => ({
  name: 'any_business_canvas_name',
  customerSegments: ['any_customer_segments'],
  valuePropositions: ['any_value_propositions'],
  channels: ['any_channels'],
  customerRelationships: ['any_customer_relationships'],
  revenueStreams: ['any_revenue_streams'],
  keyResources: ['any_key_resources'],
  keyActivities: ['any_key_activities'],
  keyPartnerships: ['any_key_partnerships'],
  costStructure: ['any_cost_structure']
})

describe('BusinessCanvasOpenAi Api', () => {
  it('Should call OpenAI with correct key', async () => {
    const sut = new BusinessCanvasOpenAiApi()
    await sut.create({ input: 'any_input' })
    expect(OpenAI).toHaveBeenCalledWith({ apiKey: 'any_key' })
  })

  it('Should return an BusinessCanvasApiModel if OpenAi create is a success', async () => {
    const sut = new BusinessCanvasOpenAiApi()
    const result = await sut.create({ input: 'any_input' }) as any
    expect(result).toEqual(makeFakeBusinessCanvasApiModel())
  })
})
