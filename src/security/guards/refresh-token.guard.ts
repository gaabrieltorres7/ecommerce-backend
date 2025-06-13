import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (!request.body || !request.body.refreshToken) {
      throw new BadRequestException('Refresh token not found in request body');
    }

    const token = request.body.refreshToken;

    try {
      const secret = this.configService.get('JWT_REFRESH_SECRET');
      const payload = await this.jwtService.verifyAsync(token, {
        secret,
      });

      request['user'] = payload;
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    return true;
  }
}
