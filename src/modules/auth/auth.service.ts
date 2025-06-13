import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { TokenService } from 'src/security/token.service';
import { PrismaUserRepository } from '../users/prisma/prisma-user-repository';
import {
  LoginDTO,
  LoginResponseDTO,
  RefreshTokenResponseDTO,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userRepository: PrismaUserRepository,
  ) {}

  async login({ email, password }: LoginDTO): Promise<LoginResponseDTO> {
    if (!email || !password) {
      throw new BadRequestException('You must provide email and password');
    }

    const user = await this.userRepository.findByEmail(
      email.toLocaleLowerCase().trim(),
    );

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const pwdCheck = await bcrypt.compare(password, user.password);

    if (!pwdCheck) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { token, refreshToken } = this.tokenService.getTokens({
      sub: user.id,
      email,
      isAdmin: user.isAdmin,
    });

    return {
      user: {
        sub: user.id,
        email: user.email,
        isAdmin: user.isAdmin ?? false,
      },
      token,
      refreshToken,
    };
  }

  async refreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<RefreshTokenResponseDTO> {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    const payload = await this.tokenService.verifyRefreshToken(refreshToken);

    if (payload.sub !== userId) {
      throw new ForbiddenException('Access Denied');
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ForbiddenException('Access Denied');
    }

    const newPayload = {
      sub: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    const newAccessToken = this.tokenService.createToken(newPayload);

    return {
      accessToken: newAccessToken,
    };
  }
}
