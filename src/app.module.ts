import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './db/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/products/product.module';
import { UserModule } from './modules/users/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    ProductModule,
    PrismaModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
