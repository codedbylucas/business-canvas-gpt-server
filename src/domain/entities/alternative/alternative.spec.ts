import { Alternative } from './alternative'

describe('Alternative Entity', () => {
  it('Should return the correct description for a Alternative', () => {
    const alternative = Alternative.create('any_description')
    const result = Alternative.getDescription(alternative)
    expect(result).toBe('any_description')
  })

  it('Should return new Alternative', () => {
    const sut = Alternative.create('any_description')
    expect(sut).toEqual({ description: 'any_description' })
  })
})
