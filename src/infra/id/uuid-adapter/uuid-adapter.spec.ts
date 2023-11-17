import { UuidAdapter } from './uuid-adapter'
import * as uuid from 'uuid'

jest.mock('uuid')

describe('Uuid Adapter', () => {
  beforeAll(() => {
    jest.spyOn(uuid, 'v4').mockReturnValue('any_id')
  })

  it('Should call uuid v4', () => {
    const sut = new UuidAdapter()
    const v4Spy = jest.spyOn(uuid, 'v4')
    sut.build()
    expect(v4Spy).toHaveBeenCalled()
  })

  it('Should return an ID if uuid v4 is a success', () => {
    const sut = new UuidAdapter()
    const idModel = sut.build()
    expect(idModel).toEqual({ id: 'any_id' })
  })
})
