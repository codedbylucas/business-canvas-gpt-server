import type { HashedModel } from '@/domain/models/output-models'
import type { ComparerDto, HashComparer, Hasher } from '@/interactions/contracts/cryptography'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor (private readonly salt: number) {}

  async hashing (value: string): Promise<HashedModel> {
    const hash = await bcrypt.hash(value, this.salt)
    return { hash }
  }

  async comparer (data: ComparerDto): Promise<boolean> {
    return await bcrypt.compare(data.value, data.hash)
  }
}
