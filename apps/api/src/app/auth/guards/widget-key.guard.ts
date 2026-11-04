import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { prisma } from '@plugin.ai/prisma-client';

@Injectable()
export class WidgetAppKeyGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const appKey =
      request.headers['x-app-key'] || request.query['appKey'] || request.body?.appKey;

    if (!appKey) {
      throw new UnauthorizedException('Missing x-app-key header or parameter');
    }

    // Lookup AppCredential in database
    const credential = await prisma.appCredential.findUnique({
      where: { appKey },
      include: { tenant: true },
    });

    if (!credential || !credential.isActive) {
      throw new UnauthorizedException('Invalid or inactive App Key');
    }

    // Origin Whitelisting verification
    const origin = request.headers['origin'] || request.headers['referer'];
    if (credential.allowedDomains && credential.allowedDomains.length > 0 && origin) {
      const originMatch = credential.allowedDomains.some((domain: string) =>
        origin.startsWith(domain) || domain === '*'
      );

      if (!originMatch) {
        throw new ForbiddenException(`Origin ${origin} is not allowed for this App Key`);
      }
    }

    // Attach tenant and credential to request context
    request.tenant = credential.tenant;
    request.credential = credential;

    return true;
  }
}
