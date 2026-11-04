import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { WidgetAppKeyGuard } from '../auth/guards/widget-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('gateway')
export class GatewayController {
  constructor(private readonly authService: AuthService) {}

  // 1. Handshake Endpoint untuk Widget
  @Post('widget/handshake')
  @UseGuards(WidgetAppKeyGuard)
  async widgetHandshake(
    @Request() req: any,
    @Body('visitorId') visitorId: string
  ) {
    return this.authService.createWidgetSession(
      req.credential.appKey,
      visitorId
    );
  }

  // 2. Health & Status
  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      service: 'Plugin.ai Gateway',
      timestamp: new Date().toISOString(),
    };
  }

  // 3. Protected Admin Resource Test
  @Get('admin/protected-resource')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'PROMPT_ENGINEER')
  adminResource(@Request() req: any) {
    return {
      message: 'Access granted to privileged resource',
      user: req.user,
    };
  }
}
