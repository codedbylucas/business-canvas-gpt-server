import { BusinessCanvasOpenAiApi } from '@/infra/api/business-canvas-open-ai-api'

export const businessCanvasOpenAiApiFactory = (): BusinessCanvasOpenAiApi => {
  return new BusinessCanvasOpenAiApi()
}
