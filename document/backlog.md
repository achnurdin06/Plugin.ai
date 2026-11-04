# Backlog & Task Breakdown – Plugin.ai

Dokumen ini memetakan daftar user stories & technical tasks dari [PRD](./document/prd.md) yang diimpor secara otomatis ke GitHub Project `plugin.ai` (#3).

---

## 🎯 Milestones / Epics

### Epic 1: Workspace & Core Foundation (Sprint 1)
- [ ] **Setup Nx Monorepo Workspace**: Inisialisasi struktur `apps/widget`, `apps/admin`, `apps/api`, `libs/shared-types`, `libs/prisma-client`, `libs/rag-engine`.
- [ ] **Database & Multi-Tenant Schema Setup**: Setup PostgreSQL 16 + pgvector, konfigurasi schema Prisma (Tenant, User, Prompt, KnowledgeItem, TokenLog, AuditLog).
- [ ] **API Gateway & Auth Middleware**: Setup NestJS API gateway, CORS origin whitelisting, App Key header validation, dan JWT RBAC guards.
- [ ] **CI/CD Pipeline Setup**: GitHub Actions workflow untuk linting, TypeScript type-check, unit test, dan Nx computation cache.

### Epic 2: Embeddable Chatbot Widget SDK (Sprint 2)
- [ ] **Lightweight Web Component & Shadow DOM**: Bangun embeddable client (<50KB gzipped) dengan enkapsulasi Shadow DOM agar CSS bebas konflik.
- [ ] **Streaming UI & Real-Time Interaction**: Integrasi SSE (Server-Sent Events) untuk streaming chat, typewriter effect, markdown parsing, syntax highlighting code block.
- [ ] **Bi-Directional Action Triggering**: SDK event dispatcher untuk mengeksekusi aksi di aplikasi host (deeplink navigasi, open modal, trigger callback).
- [ ] **Session Persistence & Inline CSAT**: Penyimpanan sesi percakapan (LocalStorage), rating Thumbs Up/Down per jawaban, dan modal survey CSAT.

### Epic 3: LLM Gateway & RAG Pipeline (Sprint 3)
- [ ] **Multi-Provider LLM Router & Fallback**: Abstraksi provider (OpenAI, Anthropic Claude, Gemini, Groq) dengan dynamic fallback circuit breaker saat kena rate limit 429.
- [ ] **Semantic Caching Layer**: Implementasi Redis semantic cache untuk query berulang guna menekan latensi dan biaya token.
- [ ] **Document Ingestion & Chunking Pipeline**: Parser dokumen (PDF, Markdown, HTML) dan background worker (BullMQ) untuk chunking dan metadata tagging.
- [ ] **Hybrid Vector Search & Re-Ranking**: Dense embeddings (pgvector) + BM25 keyword search dengan re-ranking step sebelum prompt assembly.

### Epic 4: Admin Management Portal (Sprint 4)
- [ ] **Prompt & Persona Studio**: UI interaktif untuk membuat, versioning, dan menguji prompt/persona sistem lengkap dengan live testing playground.
- [ ] **Knowledge Base & Ingestion UI**: Antarmuka untuk upload dokumen, kelola sitemap/web scraper, status sync embeddings.
- [ ] **Widget Visual Theme Customizer**: Live visual preview editor untuk styling widget (warna tema, light/dark mode, posisi bubble, logo/avatar, teks sambutan).
- [ ] **Token Observability & Cost Analytics**: Dashboard konsumsi token real-time, breakdown prompt vs completion, grafik biaya, dan alert threshold.
- [ ] **Human Handoff & Escalation Inbox**: Review transkrip obrolan, flagged low-confidence answer, dan integrasi eskalasi tiket (Zendesk / webhook / email).
- [ ] **RBAC & API Key Management**: Pengelolaan App ID, API Secret Key, domain whitelisting, serta hak akses tim (Super Admin, Prompt Engineer, Support, Viewer).
