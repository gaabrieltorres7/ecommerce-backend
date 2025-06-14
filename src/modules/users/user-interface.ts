import {
  CreateUserDTO,
  CreatedUserDTO,
} from '../../modules/users/dto/user.dto';

export abstract class IUserRepository {
  abstract create(data: CreateUserDTO): Promise<CreatedUserDTO>;
  abstract findByEmail(email: string): Promise<CreatedUserDTO | null>;
  abstract findById(id: string): Promise<CreatedUserDTO | null>;
}
