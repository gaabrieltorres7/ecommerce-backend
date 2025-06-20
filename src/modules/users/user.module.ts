import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaUserRepository } from './prisma/prisma-user-repository';
import { IUserRepository } from './user-interface';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [ConfigModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
    JwtService,
  ],
})
export class UserModule {}
