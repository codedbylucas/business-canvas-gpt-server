import { UuidAdapter } from './uuid-adapter'
import * as uuid from 'uuid'

jest.mock('uuid')

describe('Uuid Adapter', () => {
  beforeAll(() => {
    jest.spyOn(uuid, 'v4').mockReturnValue('any_id')
    jest.spyOn(uuid, 'validate').mockReturnValue(true)
  })

  describe('build()', () => {
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

  describe('isValid()', () => {
    it('Should call uuid validate is correct id', async () => {
      const sut = new UuidAdapter()
      const validateSpy = jest.spyOn(uuid, 'validate')
      sut.isValid('any_id')
      expect(validateSpy).toHaveBeenCalledWith('any_id')
    })

    it('Should return false if uuid validate fails', () => {
      const sut = new UuidAdapter()
      jest.spyOn(uuid, 'validate').mockReturnValueOnce(false)
      const result = sut.isValid('invalid_id')
      expect(result).toBe(false)
    })

    it('Should return true if uuid is a success', () => {
      const sut = new UuidAdapter()
      const result = sut.isValid('valid_id')
      expect(result).toBe(true)
    })
  })
})
