import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  createToken(payload: Record<string, unknown>) {
    return this.jwtService.sign(payload);
  }

  createRefreshToken(payload: Record<string, unknown>) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>(
        'JWT_REFRESH_EXPIRES_IN',
        '10d',
      ),
    });
  }

  getTokens(payload: Record<string, unknown>) {
    return {
      token: this.createToken(payload),
      refreshToken: this.createRefreshToken(payload),
    };
  }

  async verifyRefreshToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      return payload;
    } catch (error) {
      throw new UnauthorizedException(
        'Invalid or expired refresh token',
        error,
      );
    }
  }
}
