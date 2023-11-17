import { TemplateForInputInPersonBusiness as sut } from './template-for-input-in-person-business'

describe('TemplateForInputWithLocation', () => {
  it('Should return a TemplateInputModel', async () => {
    const result = sut.create()
    expect(result.input).toBeTruthy()
    expect(typeof result.input).toBe('string')
  })

  it('Should return TemplateInputModel that contains {{location}} and {{description}}', async () => {
    const result = sut.create()
    expect(result.input).toContain('{{location}}')
    expect(result.input).toContain('{{description}}')
  })
})
