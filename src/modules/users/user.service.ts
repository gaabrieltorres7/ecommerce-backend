import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreatedUserDTO, CreateUserDTO } from 'src/modules/users/dto/user.dto';
import { PrismaUserRepository } from 'src/modules/users/prisma/prisma-user-repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: PrismaUserRepository) {}

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
