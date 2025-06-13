import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { CreateUserDTO, CreatedUserDTO } from '../dto/user.dto';
import { IUserRepository } from '../user-interface';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDTO): Promise<CreatedUserDTO> {
    const user = await this.prisma.user.create({ data });
    return user;
  }

  async findByEmail(email: string): Promise<CreatedUserDTO | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user;
  }

  async findById(id: string): Promise<CreatedUserDTO | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user;
  }
}
