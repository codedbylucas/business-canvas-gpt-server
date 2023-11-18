import type { AccessTokenBuilder, AddRandomUser } from '@/domain/contracts'
import type { AccessTokenModel } from '@/domain/models/output-models'
import type { AddUserRepo } from '@/interactions/contracts/db'
import type { IdBuilder } from '@/interactions/contracts/id/id-builder'
import type { Hasher } from '@/interactions/contracts/cryptography'
import env from '@/main/configs/env'

export class AddRandomUserUseCase implements AddRandomUser {
  constructor (
    private readonly hasher: Hasher,
    private readonly idBuilder: IdBuilder,
    private readonly addUserRepo: AddUserRepo,
    private readonly accessTokenBuilder: AccessTokenBuilder
  ) {}

  async perform (): Promise<AccessTokenModel> {
    const { hash: password } = await this.hasher.hashing(env.randomUserPassword)
    const { id } = this.idBuilder.build()
    const email = `${id}@convidado.com`
    const date = new Date()
    const createdAt = date; const updatedAt = date
    await this.addUserRepo.add({
      id, password, email, name: 'Convidado', createdAt, updatedAt, role: 'user'
    })
    return await this.accessTokenBuilder.perform(id)
  }
}
