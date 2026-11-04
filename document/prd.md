# Product Requirement Document (PRD)

## 1. Overview
**Project Name:** AI Helpdesk & Recommendation Chatbot
**Target Audience:** Developers and product teams who need an easy‑to‑integrate AI‑powered helpdesk and recommendation engine for their web applications.

The solution consists of two main components:
1. **Chatbot Service** – a lightweight, embeddable widget that can be added to any web app. It answers user queries, provides help‑desk support, and recommends features based on the host application’s capabilities.
2. **Admin Portal** – a single‑page admin application used to configure, monitor, and maintain the chatbot.

## 2. Goals & Success Metrics
| Goal | Success Metric |
|------|----------------|
| Fast integration | < 5 minutes to embed the widget (single script tag or npm package) |
| High relevance of answers | ≥ 80 % user‑satisfaction rating (post‑interaction survey) |
| Low operational cost | ≤ $0.01 per 1 000 token usage |
| Easy maintenance | Admin UI allows CRUD of prompts, subscription plans, token usage, and access control without code changes |
| Scalability | Supports ≥ 10 000 concurrent sessions with auto‑scaling |

## 3. Scope
### 3.1 In‑Scope
- **Chatbot Widget**
  - **Lightweight & Framework-Agnostic SDK**: Tersedia via CDN script tag (`<script src="...">`), npm package (`@plugin-ai/widget`), dan Web Component (`<plugin-ai-chat>`), dengan ukuran bundle minimal (< 50 KB gzipped) dan zero conflicting CSS (menggunakan Shadow DOM).
  - **Streaming & Low-Latency UI**: Server-Sent Events (SSE) / WebSocket streaming response dengan visual typewriter effect, animasi thinking/loading state, dan audio cues opsional.
  - **Rich Interactive Messaging**: Dukungan penuh Markdown rendering (tabel, list, formatting), syntax-highlighted code blocks dengan tombol "Copy", auto-preview link, kartu rekomendasi interaktif, dan quick reply chips / suggestion pills.
  - **Host App Deeplinking & Action Triggering (Bi-directional SDK Events)**: AI dapat mengirimkan payload aksi yang memicu event di aplikasi host (misal: navigasi route, membuka modal/halaman fitur, auto-fill form, membuka onboarding wizard).
  - **Session & Conversation State Persistence**: Penyimpanan riwayat obrolan berbasis LocalStorage/SessionStorage, kemampuan reset percakapan, multi-tab synchronization, serta attachment/upload file/screenshot pendukung laporan kendala.
  - **Smart Helpdesk & Proactive Engagement**:
    - Trigger pesan proaktif berdasarkan konteks halaman pengguna (misal: jika pengguna berada di halaman checkout atau fitur kompleks selama > 30 detik).
    - FAQ / Starter Prompts dinamis berdasarkan current route/path host app.
  - **Human Handoff & Escalation Flow**: Opsi fallback langsung di dalam widget ke formulir tiket bantuan, WhatsApp/email redirect, atau live chat agent saat jawaban AI dirasa kurang memuaskan.
  - **Inline User Feedback & CSAT**: Tombol rating instan per respons (Thumbs Up / Thumbs Down) dengan modal komentar masukan singkat, serta survei CSAT di akhir percakapan.
  - **Accessibility (a11y) & Responsive UX**: Standar WCAG 2.1 AA compliant, full keyboard navigation (Tab/Enter/Esc), ARIA labels, screen reader friendly, dan adaptif sempurna di perangkat mobile (fullscreen mode / bottom drawer).
  - **Security & Client Privacy**: Sanitasi input (XSS prevention), masking otomatis data sensitif (PII seperti password/kartu kredit di sisi klien), dan transmisi aman dengan ephemeral JWT token.
- **Admin Portal**
  - **Prompt & Persona Studio**: Create, edit, versioning, system prompts, role guidelines, quick-action prompts, and live playground/testing sandbox.
  - **LLM Provider & Model Orchestration**: Multi-provider configuration (OpenAI, Anthropic, Gemini, Groq, Azure OpenAI), model fallback logic, temperature, top-p, and streaming configuration.
  - **Knowledge Base & RAG Management**: Ingestion of documents (PDF, DOCX, CSV), web crawling/sitemap URL scraping, vector search chunking/similarity threshold setting, and sync schedules.
  - **Feature Catalog & Recommendation Rules**: Manage host application feature inventory, triggers, tag mappings, and recommendation logic.
  - **Subscription, Plans & Token Quotas**: Multi-tier plan configuration (Free, Pro, Enterprise), monthly token caps, rate-limiting (RPM/TPM), overage rules, and billing/invoice tracking.
  - **Token Observability, Cost & Performance Analytics**: Real-time token consumption breakdown (prompt tokens vs. completion tokens, cost per model/app/tenant), latency metrics (TTFT), error rate, and configurable alert thresholds (email, Slack, Webhook).
  - **Chat History, Sentiment & Quality Inbox**: Full transcript inspector, user feedback analysis (thumbs up/down ratings, CSAT), flagged conversations, and manual human correction/grounding.
  - **Human Handoff & Escalation Management**: Rules for escalating failed/confused queries to human agents or ticketing tools (Zendesk, Freshdesk, Slack, Email).
  - **Widget Styling & Whitelabel Customizer**: Real-time visual customizer (brand color, light/dark mode, logo/avatar, chat bubble position, launcher icon, custom CSS, launcher text, localized greetings).
  - **Security, API Keys & Multi-Tenant Access Control (RBAC)**: App ID & Secret Key management with origin/domain whitelisting, granular permissions (Super Admin, Prompt Engineer, Support Agent, Financial/Auditor, Viewer), 2FA/SSO support, and immutable audit logs.
- **Backend Services**
  - **Multi-Tenant API Gateway & Edge Authentication**:
    - REST & SSE (Server-Sent Events) streaming endpoints.
    - Autentikasi ganda: Public App Key + Origin Whitelist (CORS) untuk Widget, dan JWT Bearer Token dengan granular RBAC untuk Admin Portal.
    - Ephemeral session handshake token untuk mengamankan obrolan klien.
  - **LLM Gateway & Intelligent Router**:
    - Unified multi-provider abstraction layer (OpenAI, Anthropic Claude, Google Gemini, Groq, Azure OpenAI, Ollama/vLLM).
    - Dynamic fallback & circuit breaker (otomatis switch provider saat rate-limit 429 atau upstream timeout).
    - Intelligent caching layer (Redis semantic cache untuk query berulang guna menghemat token dan biaya).
  - **RAG & Knowledge Base Pipeline**:
    - Document parsing & chunking engine (PDF, Markdown, HTML, DOCX) dengan metadata extraction.
    - Asynchronous web crawler & sitemap processor.
    - Vector embeddings generation & hybrid search (dense semantic vector via pgvector/Qdrant + sparse keyword BM25 search).
    - Re-ranking step (Cohere / Cross-Encoder) untuk memastikan akurasi konteks paling relevan.
  - **Feature Recommendation & Context Engine**:
    - JSON Feature Manifest validator & parser.
    - Prompt assembler dinamis yang menginjeksi: Persona, Konteks RAG, Manifest Fitur Terkait, Riwayat Percakapan (Memory Window), dan Payload Aksi yang diizinkan.
  - **Token Accounting & Quota Enforcement Engine**:
    - Real-time token counter (input tokens, output tokens, cached tokens, dan perkiraan biaya per mata uang).
    - Rate limiter berbasis Token Bucket / Leaky Bucket (RPM & TPM per App ID/Tenant).
    - Hard & soft quota manager dengan auto-cutoff dan webhook triggers saat threshold tercapai.
  - **Background Worker & Event Queue**:
    - Asynchronous task processing (BullMQ / RabbitMQ) untuk indexing dokumen, web scraping, pengiriman webhook notifikasi, pembuatan laporan analitik berkala, dan email alerts.
  - **Data Persistence & Audit Store**:
    - Relational DB (PostgreSQL) untuk metadata, relasi tenant, RBAC, konfigurasi prompt, billing, dan log audit yang immutable.
    - Time-series / telemetry store untuk metrik token dan log chat (atau partisi PostgreSQL dengan TimescaleDB/ClickHouse).
  - **Security, Compliance & Guardrails**:
    - PII (Personally Identifiable Information) detector & anonymizer sebelum prompt dikirim ke LLM publik.
    - Prompt injection & jailbreak detection (Guardrails AI / Llama Guard).
    - Enkripsi end-to-end: Enkripsi at-rest (AES-256) untuk API Keys dan dokumen, TLS 1.3 in-transit.
    - Data retention & automated deletion policy (GDPR/CCPA compliant).
  - **Observability & OpenTelemetry**:
    - Distributed tracing (OpenTelemetry / Langfuse / Arize Phoenix) untuk melacak setiap LLM call, latency TTFT, token cost, dan retrieval accuracy.
    - Prometheus metrics exporter & centralized structured JSON logging.
- **Documentation**
  - Quick‑start guide for embedding the widget
  - Admin user manual
  - API reference (OpenAPI spec)

### 3.2 Out‑of‑Scope
- Custom model training (the system uses pre‑trained LLMs)
- On‑premise deployment of the LLM itself (only API‑based inference)
- Multi‑language UI for the admin portal (initial release in English only)

## 4. Functional Requirements
| ID | Description |
|----|-------------|
| **FR‑1** | **Multi-Format Widget Embed** – Developers can integrate the chatbot via CDN script tag, npm module, or Web Component with `< 50 KB` bundle size and Shadow DOM style isolation. |
| **FR‑2** | **Streaming & Low Latency Interaction** – Chat responses are streamed via SSE/WebSocket with real-time markdown formatting, syntax highlighting, and typewriter effects. |
| **FR‑3** | **Bi-directional Host App Action & Deeplinking** – AI can trigger SDK events to perform actions on host app (open modal, navigate routes, autofill forms) based on user intent. |
| **FR‑4** | **Hybrid RAG Knowledge Retrieval** – Queries retrieve relevant documentation using hybrid vector search (dense + sparse BM25) and re-ranking before LLM synthesis. |
| **FR‑5** | **Dynamic Prompt & Persona Studio** – Admin can create, version, test, and deploy system prompts, guardrails, and role behaviors without code deployment. |
| **FR‑6** | **Multi-Provider LLM Orchestration** – Admin can configure model providers (OpenAI, Anthropic, Gemini, Groq, local models) with fallback rules and circuit breakers. |
| **FR‑7** | **Multi-Tenant Token Quota & Cost Guard** – Real-time token consumption tracking (prompt/completion/cached tokens), RPM/TPM rate limits, and threshold alerts. |
| **FR‑8** | **Human Handoff & Escalation** – Automated fallback routing to human agents or ticketing tools (Zendesk, Freshdesk, webhook) when AI confidence is low. |
| **FR‑9** | **Widget Live Customizer & Whitelabel** – Visual editor for branding (colors, light/dark mode, bot avatar, positions, localized welcome greetings). |
| **FR‑10** | **Granular RBAC & Security Gateway** – Role-based access control, domain origin whitelisting, PII anonymization, and immutable audit logging. |

## 5. Non‑Functional Requirements
| Category | Requirement |
|----------|-------------|
| **Performance** | TTFT (Time-to-First-Token) ≤ 500 ms for streaming; full response ≤ 1.5s for RAG queries; semantic cache hits ≤ 80 ms. |
| **Reliability** | 99.95% uptime SLA with automated multi-provider LLM failover. |
| **Security & Privacy** | TLS 1.3 in-transit, AES-256 at-rest, automated PII scrubbing, prompt injection guardrails, and OWASP LLM Top 10 compliance. |
| **Maintainability** | Configuration-driven architecture; Zero downtime updates for prompts, knowledge base, and model routing. |
| **Observability** | Distributed tracing (OpenTelemetry/Langfuse) across all LLM calls, Prometheus metrics, structured JSON logs. |
| **Compliance** | GDPR & CCPA compliant; supports user data deletion, opt-out, and strict data retention controls. |

## 6. User Stories
1. **As a web developer**, I want to embed the chatbot in minutes using a single script or npm package, without styling conflicts with my host application.
2. **As an end-user**, I want instant, accurate helpdesk answers and direct action recommendations (like opening relevant pages/forms) with smooth streaming.
3. **As a prompt engineer/admin**, I want to tune and version prompts in a visual studio and test them in a sandbox before pushing to production.
4. **As a financial/DevOps admin**, I need real-time token tracking, rate limits, and cost alerts per tenant/application to prevent budget overruns.
5. **As a customer support lead**, I want to review conversation quality, view CSAT ratings, and ensure queries seamlessly escalate to human agents when needed.

## 7. Architecture Overview
```
+-------------------------------------------------------------+
|                      Host Web Application                   |
|  +-------------------------------------------------------+  |
|  |           Plugin.ai Chatbot Widget (Shadow DOM)       |  |
|  |  - SSE Streaming UI    - Action Event Dispatcher      |  |
|  |  - Inline Feedback     - Session & State Store        |  |
|  +-------------------------------------------------------+  |
+-------------------------------------------------------------+
                            |            ^
          HTTPS / SSE Stream|            | Bi-directional Actions / Events
                            v            |
+-------------------------------------------------------------+
|               Multi-Tenant Backend API Gateway              |
|  +-------------------------------------------------------+  |
|  | Edge Auth, Origin Whitelist & PII Anonymizer Masking  |  |
|  +-------------------------------------------------------+  |
|                            |                                |
|    +-----------------------+-----------------------+        |
|    | Semantic Cache (Redis)|                       |        |
|    +-----------------------+                       v        |
|    v                                    +-----------------+ |
|  +-------------------------+            |  RAG Pipeline   | |
|  | LLM Router & Orchestrator|<--------->|  - Chunking     | |
|  | (OpenAI, Anthropic,     |            |  - Vector Store | |
|  |  Gemini, Fallback Rules)|            |  - Re-ranking   | |
|  +-------------------------+            +-----------------+ |
|    |                                                        |
|    +-----------------------+-----------------------+        |
|                            |                       |        |
|                            v                       v        |
|                 +--------------------+   +----------------+ |
|                 | Token Accounting & |   | Background     | |
|                 | Quota Enforcement  |   | Worker/Queue   | |
|                 +--------------------+   +----------------+ |
+-------------------------------------------------------------+
                            ^
                            | REST & WebSocket
+-------------------------------------------------------------+
|                     Admin Management Portal                 |
|  - Prompt & Persona Studio      - Live Testing Playground   |
|  - RAG / Knowledge Base Ingestion- Real-time Token Metrics  |
|  - Live Widget Theme Customizer - RBAC, Audit & Escalation  |
+-------------------------------------------------------------+
```

## 8. Milestones & Timeline
| Milestone | Duration | Deliverable |
|-----------|----------|------------|
| **M1 – Architecture & Foundation** | 1 week | Repo structure, DB schema (PostgreSQL + pgvector), Redis, multi-tenant auth & RBAC |
| **M2 – LLM Gateway & RAG Pipeline** | 2 weeks | Multi-provider router, fallback circuit breaker, document parser, vector search & semantic cache |
| **M3 – Chatbot Widget SDK** | 2 weeks | Framework-agnostic Shadow DOM widget, SSE streaming, bi-directional host events, inline CSAT |
| **M4 – Admin Portal (Core Studio)** | 2.5 weeks | Prompt & persona editor, model orchestration settings, RAG knowledge uploader, live playground |
| **M5 – Analytics, Quota & Customizer** | 1.5 weeks | Real-time token dashboard, cost telemetry, widget visual customizer, human handoff integration |
| **M6 – QA, Security & Benchmarking** | 1.5 weeks | Load testing (10k sessions), PII & prompt injection security checks, latency optimization |
| **M7 – Documentation & Launch** | 1 week | SDK quick-start docs, Admin user manual, OpenAPI specification |

## 9. Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| LLM API rate limits or outages | High | Multi-provider fallback router with automated circuit breaker |
| Unexpected token & operational cost explosion | High | Hard/soft monthly quotas, Token Bucket rate limiting, and Redis semantic caching |
| Hallucinations or inaccurate answers | High | Strict RAG retrieval with threshold cutoffs, citation links, and human escalation handoff |
| CSS or script collisions with host apps | Medium | Encapsulation via Shadow DOM and lightweight vanilla TypeScript build |
| PII or sensitive data leaks | High | Automated client & server-side PII scrubbing before reaching external LLMs |

## 10. Acceptance Criteria
- Embeddable widget initializes via a single script tag/npm package under 50KB without CSS collision.
- End-to-end streaming response with TTFT < 500ms and active semantic caching for recurring queries.
- Host web application can receive and execute deep-link/action events sent by the chatbot.
- Admin Portal enables zero-code prompt tuning, model provider switching, and RAG knowledge ingestion.
- Real-time token usage and cost analytics accurately track usage and enforce quota cutoffs.
- In-widget feedback and automated human handoff trigger tickets/escalations appropriately.
- Security and compliance standards (PII masking, RBAC, domain whitelisting, audit log) verified.
- Complete documentation hosted in the `document/` folder.

## 11. Competitive Landscape & Market Research
Berdasarkan analisis produk sejenis di industri (seperti **eesel AI**, **Help-Desk.ai**, **Moveworks**, **Chatbase**, dan **Desk365**), ditemukan pola dan fitur standar yang menjadi keunggulan kompetitif:
- **Eesel AI**: Fokus pada kemudahan *no-code setup*, scraping/integrasi knowledge base internal, dan fitur *Human-in-the-loop* (eskalasi ke agen manusia bila AI ragu).
- **Chatbase / Help-Desk.ai**: Kemudahan embed satu baris script, ingestion data via URL/sitemap dan dokumen (PDF, Notion, Docs), serta white-labeling widget.
- **Moveworks**: Menekankan *agentic workflow*, kapabilitas menjalankan tindakan/aksi (*action execution*) bukan sekadar menjawab pertanyaan, serta integrasi sistem tiket seperti Jira/ServiceNow.

### Implikasi Fitur Tambahan untuk Plugin.ai:
1. **Knowledge Base Ingestion (RAG)**: Selain manifest fitur, admin dapat menambahkan URL docs atau mengunggah file panduan untuk memperkaya konteks rekomendasi & helpdesk.
2. **Human Handoff / Escalation**: Integrasi tombol "Hubungi Agen" atau tiket support ketika AI tidak dapat menjawab masalah pengguna.
3. **Widget Customization & Whitelabel**: Konfigurasi warna, posisi, nama bot, logo, dan pesan sapaan (*greeting*) langsung dari Admin Portal.
4. **Action & Deeplinking Recommendation**: Fitur rekomendasi tidak hanya teks, tapi dapat mengarahkan/membuka modal fitur di aplikasi host secara langsung via SDK Event.

## 12. Technical Stack & Implementation Architecture (All‑in‑One Package)
Untuk menjamin konsistensi tipe, kecepatan rilis, efisiensi resource, dan pemeliharaan jangka panjang, disepakati satu paket teknologi terpadu berbasis **TypeScript Fullstack Monorepo**.

### 12.1 Monorepo & Workspace Management
- **Tooling**: [Nx Monorepo](https://nx.dev/)
- **Struktur Repositori**:
  - `apps/widget`: Embeddable SDK client library (Vanilla TypeScript + React custom web component, Shadow DOM, bundler Rollup/tsup < 50 KB).
  - `apps/admin`: Admin Management Portal (Next.js App Router, Tailwind CSS, Shadcn UI / Headless UI).
  - `apps/api`: Core Backend Engine & LLM Gateway (NestJS, Fastify adapter).
  - `libs/shared-types`: Skema validasi bersama (Zod / TypeScript interfaces) untuk API contracts, DTO, dan SDK events.
  - `libs/prisma-client`: Prisma ORM schema, repository layer, dan modul database migration.
  - `libs/rag-engine`: Modul parsing dokumen, embeddings generation, dan hybrid vector search connector.

### 12.2 Layer Spesifikasi Teknologi
| Komponen Sistem | Teknologi / Framework | Alasan & Peran Spesifik |
|---|---|---|
| **Embeddable Widget** | TypeScript + Web Components (Shadow DOM) | Isolasi styling total dari aplikasi host, performa rendering tinggi, bundle footprint ringan (<50 KB). |
| **Admin Portal** | Next.js 15+ (React 19) + Tailwind CSS + TanStack Query | Server Components (RSC) untuk pemuatan data cepat, dashboard reaktif, dan integrasi mudah dengan auth/analytics. |
| **API Gateway & Core Service** | NestJS (Node.js) | Arsitektur modular enterprise, dependency injection kuat, performa streaming SSE native yang stabil. |
| **Database Relasional & Vektor** | PostgreSQL 16+ dengan ekstensi `pgvector` | Satu solusi storage untuk data relasional (tenant, user, billing) dan dense vector embeddings (RAG) tanpa dependensi database eksternal tambahan. |
| **ORM & Data Modeling** | Prisma ORM | Type-safety end-to-end, migrasi skema terstruktur, dan integrasi mudah dengan NestJS/Next.js. |
| **Caching & In-Memory Store** | Redis (ioredis / Valkey) | Semantic cache respons query umum guna menekan biaya token LLM, distributed rate-limiter, dan session handshake token. |
| **Asynchronous Job Worker** | BullMQ (berbasis Redis) | Mengelola task asinkron berat: ingestion PDF/dokumen, sitemap web scraping, dan pengiriman batch webhook/email. |
| **AI / LLM Orchestration** | LangChain Core / Vercel AI SDK / Direct Provider SDKs | Provider switching dinamis (OpenAI, Anthropic Claude, Gemini, Groq), model fallback circuit breaker, dan streaming formatter. |
| **Security & Guardrails** | Zod (payload validation), DOMPurify (sanitasi), Custom PII Regex/Scrubber | Mencegah XSS, masking PII sebelum request diteruskan ke penyedia LLM publik, dan domain origin whitelisting. |
| **Observability & Monitoring** | OpenTelemetry SDK + Prometheus + Grafana | Distributed tracing untuk mengukur latency LLM (TTFT), token consumption metrics, dan error tracking terpusat. |

### 12.3 Deployment & Infrastructure Baseline
- **Containerization**: Multi-stage Dockerfile untuk build ringan (Alpine-based Node image).
- **Orchestration**: Kubernetes Helm Chart / Docker Compose untuk setup lokal.
- **CI/CD Pipeline**: GitHub Actions dengan Nx Cloud computation caching untuk build & test paralel yang cepat.
- **CDN Distribution**: Cloudflare / AWS CloudFront untuk hosting build artefak script widget publik (`widget.js`).

---
*Prepared on 2026‑11‑04.*
