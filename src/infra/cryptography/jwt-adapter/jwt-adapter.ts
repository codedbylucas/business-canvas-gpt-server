import type { Decrypter, Encrypter, EncrypterDto } from '@/interactions/contracts/cryptography'
import type { AccessTokenModel } from '@/domain/models/output-models'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secretKey: string) {}

  async encrypt (data: EncrypterDto): Promise<AccessTokenModel> {
    let expiresIn: string | undefined
    if (data.expiresInHours && data.expiresInHours > 0) {
      expiresIn = data.expiresInHours.toString() + 'h'
    }
    const token = jwt.sign({ value: data.value }, this.secretKey, { expiresIn })
    return { token }
  }

  async decrypt (token: string): Promise<null | string> {
    try {
      const { value }: any = jwt.verify(token, this.secretKey)
      return value
    } catch (error: any) {
      const errors = ['JsonWebTokenError', 'NotBeforeError', 'TokenExpiredError', 'SyntaxError']
      for (const name of errors) {
        if (error.name === name) {
          return null
        }
      }
      throw new Error(error.message)
    }
  }
}
