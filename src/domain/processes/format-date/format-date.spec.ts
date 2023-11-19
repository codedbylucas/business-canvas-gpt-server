import { FormatDate as sut } from './format-date'

describe('FormatDate', () => {
  it('Should returns a formatted date', async () => {
    const date = new Date('2023-01-31T00:00:00')
    const formattedDate = sut.execute(date)
    expect(formattedDate).toBe('31/01/2023')
  })

  it('Should returns a formatted date (2)', async () => {
    const date = new Date('2023-01-01T00:00:00')
    const formattedDate = sut.execute(date)
    expect(formattedDate).toBe('01/01/2023')
  })
})
