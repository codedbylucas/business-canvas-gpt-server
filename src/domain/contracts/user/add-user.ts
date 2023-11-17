import type { Either } from '@/shared/either'
import type { UserDto } from '../../entities/user'
import type { InvalidEmailError, InvalidNameError, InvalidPasswordError } from '../../entities/user/errors'
import type { EmailInUseError } from '../../errors'
import type { AccessTokenModel } from '../../models/output-models'

export type AddUserRes = Either<
InvalidNameError | InvalidEmailError | InvalidPasswordError | EmailInUseError, AccessTokenModel
>

export interface AddUser {
  perform: (dto: UserDto) => Promise<AddUserRes>
}
