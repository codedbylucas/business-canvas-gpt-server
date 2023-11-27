import type { InvalidEmailError, InvalidNameError, InvalidPasswordError } from '@/domain/entities/user/errors'
import type { UserDto } from '@/domain/entities/user'
import type { EmailInUseError } from '@/domain/errors'
import type { AddUserResModel } from '@/domain/models/output-models'
import type { Either } from '@/shared/either'

export type AddUserRes = Either<
InvalidNameError | InvalidEmailError | InvalidPasswordError | EmailInUseError, AddUserResModel
>

export interface AddUser {
  perform: (dto: UserDto) => Promise<AddUserRes>
}
