import { prisma, Role, FileType, DocumentStatus } from '../libs/prisma-client/src/index';

async function main() {
  console.log('Seeding initial multi-tenant test data...');

  // 1. Create Tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'acme-corp' },
    update: {},
    create: {
      name: 'Acme Corporation',
      slug: 'acme-corp',
    },
  });

  console.log(`Tenant created/found: ${tenant.name} (${tenant.id})`);

  // 2. Create Super Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@acme.com' },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'admin@acme.com',
      password: 'argon2-hashed-password-placeholder',
      name: 'Acme Admin',
      role: Role.SUPER_ADMIN,
    },
  });

  console.log(`Super Admin user created: ${admin.email}`);

  // 3. Create App Credential for Widget
  const credential = await prisma.appCredential.upsert({
    where: { appKey: 'pk_live_acme_widget_key_01' },
    update: {},
    create: {
      tenantId: tenant.id,
      appKey: 'pk_live_acme_widget_key_01',
      secretHash: 'sk_live_secret_hash_demo',
      allowedDomains: ['http://localhost:4200', 'https://acme.com'],
      rateLimitRpm: 60,
      rateLimitTpm: 15000,
    },
  });

  console.log(`App Credential created: AppKey ${credential.appKey}`);

  // 4. Create Active Prompt Version
  const prompt = await prisma.promptVersion.upsert({
    where: {
      tenantId_version: {
        tenantId: tenant.id,
        version: 1,
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      version: 1,
      systemPrompt: 'You are an intelligent customer support assistant for Acme Corp.',
      guardrails: ['Do not disclose confidential pricing formulas', 'Be polite and concise'],
      temperature: 0.7,
      topP: 0.9,
      maxTokens: 1024,
      model: 'gpt-4o-mini',
      isActive: true,
      createdBy: admin.id,
    },
  });

  console.log(`Active Prompt Version created: v${prompt.version}`);
  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
