import type { AccessTokenBuilder, AddUser, AddUserRes } from '@/domain/contracts'
import type { AddUserRepo, FetchUserByEmailRepo } from '../../../contracts/db'
import type { Hasher } from '../../../contracts/cryptography'
import type { IdBuilder } from '../../../contracts/id/id-builder'
import { User, type UserDto } from '@/domain/entities/user'
import { EmailInUseError } from '@/domain/errors'
import { left, right } from '@/shared/either'

export class AddUserUseCase implements AddUser {
  constructor (
    private readonly fetchUserByEmailRepo: FetchUserByEmailRepo,
    private readonly hasher: Hasher,
    private readonly idBuilder: IdBuilder,
    private readonly addUserRepo: AddUserRepo,
    private readonly accessTokenBuilder: AccessTokenBuilder
  ) {}

  async perform (dto: UserDto): Promise<AddUserRes> {
    const userResult = User.create(dto)
    if (userResult.isLeft()) {
      return left(userResult.value)
    }
    const { email, name, password } = dto
    const user = await this.fetchUserByEmailRepo.fetchByEmail(email)
    if (user) {
      return left(new EmailInUseError(email))
    }
    const { hash } = await this.hasher.hashing(password)
    const { id } = this.idBuilder.build()
    const date = new Date()
    await this.addUserRepo.add({
      id, name, email, password: hash, role: 'user', createdAt: date, updatedAt: date
    })
    const { token } = await this.accessTokenBuilder.perform(id)
    return right({ userName: name, token })
  }
}
