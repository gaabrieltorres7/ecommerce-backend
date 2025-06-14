import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreatedUserDTO, CreateUserDTO } from 'src/modules/users/dto/user.dto';
import { IUserRepository } from './user-interface';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async create({
    email,
    password,
    isAdmin,
  }: CreateUserDTO): Promise<CreatedUserDTO> {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.create({
      email,
      password: hashedPassword,
      isAdmin,
    });

    return user;
  }
}
