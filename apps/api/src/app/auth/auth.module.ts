import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { WidgetAppKeyGuard } from './guards/widget-key.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, WidgetAppKeyGuard, JwtAuthGuard, RolesGuard],
  exports: [AuthService, JwtModule, WidgetAppKeyGuard, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
