import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { prisma } from '@plugin.ai/prisma-client';
import { Role } from '@plugin.ai/shared-types';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // 1. Handshake token untuk Chatbot Widget Client
  async createWidgetSession(appKey: string, visitorId: string) {
    const credential = await prisma.appCredential.findUnique({
      where: { appKey },
      include: { tenant: true },
    });

    if (!credential || !credential.isActive) {
      throw new UnauthorizedException('Invalid or inactive App Key');
    }

    // Upsert / find ChatSession
    const session = await prisma.chatSession.create({
      data: {
        tenantId: credential.tenantId,
        appKey: credential.appKey,
        visitorId: visitorId || `anon_${Date.now()}`,
      },
    });

    const sessionToken = await this.jwtService.signAsync({
      sub: session.id,
      tenantId: credential.tenantId,
      visitorId: session.visitorId,
      appKey: credential.appKey,
      type: 'widget_session',
    });

    return {
      sessionId: session.id,
      sessionToken,
      tenantName: credential.tenant.name,
    };
  }

  // 2. Admin User Login
  async loginAdmin(email: string, role: Role = 'SUPER_ADMIN') {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { tenant: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      type: 'admin_user',
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenant: user.tenant,
      },
    };
  }
}
