# Laporan Penyelesaian Sprint 1: Arsitektur Monorepo, Data Modeling, API Gateway & CI/CD

- **Proyek:** Plugin.ai (Multi-Tenant AI Chatbot SDK & Admin Platform)
- **Sprint:** Sprint 1 / Epic 1 (Core Architecture & Backend Foundations)
- **Status:** Selesai (Completed & Verified)
- **Branch:** `Main`
- **Commit:** `51ab2cd`
- **Tautan Repositori:** [https://github.com/achnurdin06/Plugin.ai](https://github.com/achnurdin06/Plugin.ai)
- **Tautan GitHub Project:** [https://github.com/users/achnurdin06/projects/3](https://github.com/users/achnurdin06/projects/3)

---

## 1. Ringkasan Eksekutif Sprint 1

Tujuan utama Sprint 1 adalah membangun fondasi arsitektur perangkat lunak yang tangguh, modular, scalable, dan siap mendukung multi-tenancy sebelum layer UI widget serta RAG engine diimplementasikan pada sprint-sprint berikutnya.

Seluruh target pada 4 backlog user stories/tasks Sprint 1 telah diselesaikan 100% dan seluruh tiket GitHub Issue terkait (#2, #3, #4, #5) telah diverifikasi dan ditutup pada GitHub Projects `#3`.

---

## 2. Rincian Fitur & Komponen yang Berhasil Diselesaikan

### Task 1: Setup Nx Monorepo Workspace Architecture (GitHub Issue #2)
- **Inisialisasi Monorepo:** Dikonfigurasi menggunakan Nx Monorepo berbasis TypeScript dengan manajemen dependensi terpusat (`package.json`, `nx.json`, `tsconfig.base.json`).
- **Apps Scaffolding:**
  - `apps/api`: Backend service inti menggunakan NestJS, mendukung modular architecture, controller, service, dan guards.
  - `apps/admin`: Portal manajemen tenant menggunakan Next.js App Router dengan dukungan styling modern.
  - `apps/widget`: Client SDK chatbot ringan berbasis Vite yang dirancang untuk di-compile menjadi Web Component / Shadow DOM (<50 KB bundle).
- **Shared Libraries (`libs/`):**
  - `libs/shared-types`: Kontrak tipe TypeScript (TypeScript interfaces/types) yang digunakan bersama antar backend, admin portal, dan widget.
  - `libs/prisma-client`: Layer akses database terpusat dengan singleton instance PrismaClient.
  - `libs/rag-engine`: Library terisolasi untuk pipeline ingestion, chunking, embedding, dan hybrid search RAG.

### Task 2: Database & Multi-Tenant Data Modeling (GitHub Issue #3)
- **Database Engine:** PostgreSQL 16 dengan ekstensi `pgvector` (`vector(1536)`).
- **Skema Relasional & Vektor (`prisma/schema.prisma`):**
  - `Tenant`: Isolasi data multi-tenant tingkat enterprise.
  - `User` & `Role`: Manajemen user dengan hak akses berjenjang (`SUPER_ADMIN`, `PROMPT_ENGINEER`, `SUPPORT_AGENT`, `VIEWER`).
  - `AppCredential`: Pengelolaan Public App Key (`pk_live_...`), Secret Hash (`sk_live_...`), dan domain origin whitelisting untuk widget embed.
  - `PromptVersion`: Versioning System Prompt, guardrails, model parameter (`temperature`, `topP`, `maxTokens`, `model`).
  - `KnowledgeDocument` & `VectorChunk`: Penyimpanan dokumen knowledge base berserta potongan chunk teks, metadata JSON, dan vector embedding.
  - `ChatSession` & `ChatMessage`: Jejak obrolan, visitor ID, per-message token tracking, dan cache flag.
  - `TokenConsumptionLog`: Pencatatan konsumsi prompt tokens, completion tokens, dan estimasi biaya per request.
  - `FeedbackCSAT`: Penyimpanan rating CSAT (1-5 / Thumbs up-down) dan komentar pengguna.
  - `AuditLog`: Log audit aktivitas pengguna yang immutable untuk kepatuhan keamanan.
- **Data Seeding (`prisma/seed.ts`):**
  - Script seed otomatis untuk inisialisasi tenant awal (`acme-corp`), super admin, kredensial widget, dan versi prompt aktif pertama.

### Task 3: Multi-Tenant API Gateway & Auth Guard (GitHub Issue #4)
- **Widget Authentication Guard (`WidgetAppKeyGuard`):**
  - Memvalidasi header `x-app-key` pada setiap request dari widget client.
  - Memverifikasi apakah App Key aktif dan domain asal (`Origin` / `Referer`) terdaftar dalam whitelist tenant.
- **JWT Admin Authentication Guard (`JwtAuthGuard`):**
  - Memvalidasi Bearer JWT token untuk endpoint administratif.
- **Role-Based Access Control Guard (`RolesGuard` & `@Roles` Decorator):**
  - Enkapsulasi hak akses per endpoint (misalnya hanya `SUPER_ADMIN` atau `PROMPT_ENGINEER` yang boleh mengubah prompt dan guardrails).
- **Gateway Handshake Endpoint (`GatewayController`):**
  - Endpoint `POST /api/gateway/widget/handshake` untuk menginisiasi sesi chat publik yang aman dan menerbitkan token ephemeral per pengunjung.
  - Endpoint `GET /api/gateway/health` untuk health-check service.

### Task 4: CI/CD Pipeline & Docker Containerization (GitHub Issue #5)
- **Automated CI Workflow (`.github/workflows/ci.yml`):**
  - Otomatis berjalan pada setiap push / PR ke branch `main`, `master`, dan `develop`.
  - Tahapan: Checkout kode, setup Node.js 20, instalasi dependencies dengan caching npm, generate Prisma Client, dan validasi kompilasi TypeScript (`tsc --noEmit`).
- **Containerization (`apps/api/Dockerfile`):**
  - Multi-stage Docker build berbasis `node:20-alpine` untuk meminimalkan ukuran image produksi, memisahkan stage `builder` dan `runner`.

---

## 3. Matriks Status Backlog Sprint 1

| ID | Issue | Judul Backlog | Target Sprint | Status Akhir |
|:---|:---|:---|:---|:---|
| TASK-01 | [#2](https://github.com/achnurdin06/Plugin.ai/issues/2) | Setup Nx Monorepo Workspace Architecture | Sprint 1 | **Done (Closed)** |
| TASK-02 | [#3](https://github.com/achnurdin06/Plugin.ai/issues/3) | Database & Multi-Tenant Data Modeling | Sprint 1 | **Done (Closed)** |
| TASK-03 | [#4](https://github.com/achnurdin06/Plugin.ai/issues/4) | Multi-Tenant API Gateway & Auth Guard | Sprint 1 | **Done (Closed)** |
| TASK-04 | [#5](https://github.com/achnurdin06/Plugin.ai/issues/5) | CI/CD Pipeline & GitHub Actions Automation | Sprint 1 | **Done (Closed)** |

---

## 4. Kesimpulan dan Kesiapan Memasuki Sprint 2

Sprint 1 berhasil membangun pondasi arsitektur menyeluruh:
1. Workspace monorepo terstruktur rapi dan siap menampung pengembangan paralel antara widget SDK, admin portal Next.js, dan backend NestJS.
2. Layer data PostgreSQL + `pgvector` telah siap untuk kebutuhan transaksi multi-tenant maupun kebutuhan RAG vector similarity search.
3. Layer keamanan ganda (App Key whitelisting untuk browser client + JWT/RBAC untuk portal admin) telah aktif di gateway.
4. Repositori dilengkapi CI/CD otomatis untuk menjamin kualitas kode setiap ada perubahan baru.

### Langkah Selanjutnya (Sprint 2: Embeddable Widget SDK & Interactive Chat UI):
- **Issue #6:** Implementasi Web Component SDK ringan berbasis Shadow DOM (<50 KB) yang siap di-inject ke berbagai website via script tag.
- **Issue #7:** Real-time streaming conversation UI via Server-Sent Events (SSE) dengan parser Markdown dan syntax highlighting.
- **Issue #8:** Mekanisme bi-directional action dispatching dan deep linking ke aplikasi host.
- **Issue #9:** Presistensi sesi percakapan lokal dan modul feedback CSAT.
