import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { ZodValidationPipe } from 'nestjs-zod';
import { RefreshTokenGuard } from 'src/security/guards/refresh-token.guard';
import { AuthService } from './auth.service';
import { LoginDTO, RefreshTokenDTO } from './dto/auth.dto';
import { LoginSchema } from './schemas/login.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginSchema))
  login(@Body() body: LoginDTO) {
    return this.authService.login(body);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  refreshToken(@Request() req: ExpressRequest, @Body() body: RefreshTokenDTO) {
    const userId = req.user.sub;
    const refreshToken = body.refreshToken;

    return this.authService.refreshToken(userId, refreshToken);
  }
}
