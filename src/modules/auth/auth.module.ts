import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SecurityModule } from 'src/security/security.module';
import { PrismaUserRepository } from '../users/prisma/prisma-user-repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [SecurityModule],
  controllers: [AuthController],
  providers: [AuthService, PrismaUserRepository, JwtService],
})
export class AuthModule {}
