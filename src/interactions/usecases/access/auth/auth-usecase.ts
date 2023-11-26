import type { AccessTokenBuilder, Auth, AuthDto, AuthRes } from '@/domain/contracts'
import type { FetchUserByEmailRepo } from '@/interactions/contracts/db'
import type { HashComparer } from '@/interactions/contracts/cryptography'
import { InvalidCredentialsError } from '@/domain/errors'
import { left, right } from '@/shared/either'
import { Email } from '@/domain/entities/user/value-objects'

export class AuthUseCase implements Auth {
  constructor (
    private readonly fetchUserByEmailRepo: FetchUserByEmailRepo,
    private readonly hashComparer: HashComparer,
    private readonly accessTokenBuilder: AccessTokenBuilder
  ) {}

  async perform (dto: AuthDto): Promise<AuthRes> {
    const { email, password } = dto
    const emailResult = Email.create(email)
    if (emailResult.isLeft()) {
      return left(emailResult.value)
    }
    const user = await this.fetchUserByEmailRepo.fetchByEmail(email)
    if (!user) {
      return left(new InvalidCredentialsError())
    }
    const comparerResult = await this.hashComparer.comparer({
      value: password, hash: user.password
    })
    if (!comparerResult) {
      return left(new InvalidCredentialsError())
    }
    const { token } = await this.accessTokenBuilder.perform(user.id)
    return right({ userName: user.name, token })
  }
}
