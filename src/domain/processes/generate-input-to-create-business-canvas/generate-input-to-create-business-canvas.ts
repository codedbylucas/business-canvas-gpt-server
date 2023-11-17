import type { InputToCreateBusinessCanvas } from '../../models/output-models'
import { TemplateForInputInPersonBusiness, TemplateForInputOnlineBusiness } from '../input-templates'

export interface GenerateInputToCreateBusinessCanvasDto {
  typeOfBusiness: string
  businessDescription: string
  locationOrTargetAudience?: string
}

export class GenerateInputToCreateBusinessCanvas {
  static execute (dto: GenerateInputToCreateBusinessCanvasDto): InputToCreateBusinessCanvas {
    if (dto.locationOrTargetAudience) {
      let { input } = TemplateForInputInPersonBusiness.create()
      input = input.replace('{{description}}', dto.businessDescription)
      input = input.replace('{{location}}', dto.locationOrTargetAudience)
      return { text: input }
    }
    let { input } = TemplateForInputOnlineBusiness.create()
    input = input.replace('{{description}}', dto.businessDescription)
    return { text: input }
  }
}
