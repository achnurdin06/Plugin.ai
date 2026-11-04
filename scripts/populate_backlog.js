const { execSync } = require("child_process");

const PROJECT_NUMBER = 3;
const OWNER = "achnurdin06";
const REPO = "achnurdin06/Plugin.ai";

const issues = [
  // Sprint 1 / Epic 1
  {
    title: "[Sprint 1] Setup Nx Monorepo Workspace Architecture",
    body: `### Deskripsi
Inisialisasi workspace Nx Monorepo berbasis TypeScript sesuai spesifikasi PRD Section 12.

### Subtasks
- [ ] Buat apps/widget (Web Component / Shadow DOM SDK)
- [ ] Buat apps/admin (Next.js App Router)
- [ ] Buat apps/api (NestJS Core & API Gateway)
- [ ] Setup libs/shared-types, libs/prisma-client, libs/rag-engine
- [ ] Konfigurasi path mapping di tsconfig.base.json`,
  },
  {
    title: "[Sprint 1] Database & Multi-Tenant Data Modeling (PostgreSQL + pgvector)",
    body: `### Deskripsi
Setup model data relasional dan vektor menggunakan Prisma ORM dengan ekstensi pgvector.

### Subtasks
- [ ] Definisi skema Tenant, User, Role, AppCredential
- [ ] Definisi skema PromptVersion, KnowledgeDocument, VectorChunk
- [ ] Definisi skema TokenConsumptionLog, AuditLog, ChatSession, FeedbackCSAT
- [ ] Setup migrasi awal dan seed data lokal`,
  },
  {
    title: "[Sprint 1] Multi-Tenant API Gateway & Auth Guard",
    body: `### Deskripsi
Membangun endpoint gateway di NestJS dengan validasi autentikasi ganda.

### Subtasks
- [ ] Validasi Public App Key + CORS Domain Origin Whitelisting untuk widget
- [ ] Autentikasi JWT Bearer + RBAC (Super Admin, Prompt Engineer, Support, Viewer) untuk Admin
- [ ] Ephemeral session handshake token untuk sesi chat publik`,
  },
  {
    title: "[Sprint 1] CI/CD Pipeline & GitHub Actions Automation",
    body: `### Deskripsi
Setup workflow otomatisasi build, lint, dan testing di repositori GitHub.

### Subtasks
- [ ] Workflow Nx cache & type-check
- [ ] Workflow unit test (Jest)
- [ ] Docker build container pipeline untuk apps/api dan apps/admin`,
  },

  // Sprint 2 / Epic 2
  {
    title: "[Sprint 2] Embeddable Chatbot Widget SDK (Lightweight & Shadow DOM)",
    body: `### Deskripsi
Membangun bundle SDK chatbot ringan (<50 KB) yang dapat di-embed ke berbagai aplikasi web tanpa bentrok CSS.

### Subtasks
- [ ] Enkapsulasi Web Component dengan Shadow DOM
- [ ] Dukungan CDN script tag (<script src="...">) dan npm package
- [ ] Auto-mount dan lazy loading icon launcher`,
  },
  {
    title: "[Sprint 2] Streaming Chat UI & Interactive Markdown Renderer",
    body: `### Deskripsi
Tampilan antarmuka percakapan interaktif dengan streaming real-time Server-Sent Events (SSE).

### Subtasks
- [ ] Koneksi SSE streaming dengan typewriter animation effect
- [ ] Markdown parser lengkap (tabel, list, formatting)
- [ ] Syntax-highlighted code block dengan tombol Copy
- [ ] Loading & thinking state animation`,
  },
  {
    title: "[Sprint 2] Bi-Directional Host App Action & Deeplinking",
    body: `### Deskripsi
AI dapat mengirimkan payload action yang dieksekusi oleh aplikasi host web pengguna.

### Subtasks
- [ ] Event dispatcher SDK ke window host app
- [ ] Handler rekomendasi deeplink rute aplikasi
- [ ] Action modal trigger & quick suggestion pills`,
  },
  {
    title: "[Sprint 2] Session State Persistence & Inline CSAT Feedback",
    body: `### Deskripsi
Penyimpanan riwayat obrolan dan pengumpulan feedback pengguna.

### Subtasks
- [ ] Simpan state percakapan di LocalStorage / SessionStorage
- [ ] Multi-tab sync & clear conversation button
- [ ] Tombol rating Thumbs Up / Thumbs Down per respons AI
- [ ] Dialog survei CSAT di akhir percakapan`,
  },

  // Sprint 3 / Epic 3
  {
    title: "[Sprint 3] Multi-Provider LLM Gateway & Dynamic Fallback Router",
    body: `### Deskripsi
Abstraksi multi-provider LLM dengan fallback otomatis jika terjadi rate limit 429 atau upstream timeout.

### Subtasks
- [ ] Adapter OpenAI, Anthropic Claude, Google Gemini, Groq
- [ ] Dynamic fallback circuit breaker logic
- [ ] Rate-limit tracker (RPM & TPM per App Key)`,
  },
  {
    title: "[Sprint 3] Redis Semantic Caching & Token Cost Optimization",
    body: `### Deskripsi
Menghemat konsumsi token LLM dan menurunkan response latency dengan semantic response cache.

### Subtasks
- [ ] Setup Redis / Valkey semantic cache layer
- [ ] Matching query serupa menggunakan threshold kemiripan embedding
- [ ] TTL & cache invalidation rules`,
  },
  {
    title: "[Sprint 3] Asynchronous Document Ingestion & Chunking Pipeline (BullMQ)",
    body: `### Deskripsi
Pipeline pemrosesan knowledge base dokumen asinkron untuk RAG.

### Subtasks
- [ ] Parsing file PDF, Markdown, DOCX, dan scraping URL web/sitemap
- [ ] Smart chunking dengan metadata tagging
- [ ] BullMQ job worker untuk batch embedding generation`,
  },
  {
    title: "[Sprint 3] Hybrid Vector Search & Re-Ranking RAG Pipeline",
    body: `### Deskripsi
Pencarian konteks akurat menggunakan kombinasi semantic search dan keyword search.

### Subtasks
- [ ] Dense vector similarity search via pgvector
- [ ] Sparse BM25 keyword matching
- [ ] Re-ranking score sebelum konteks diinjeksi ke prompt LLM`,
  },

  // Sprint 4 / Epic 4
  {
    title: "[Sprint 4] Admin Prompt & Persona Studio with Live Playground",
    body: `### Deskripsi
Portal studio untuk mengonfigurasi dan menguji prompt AI tanpa deploy kode.

### Subtasks
- [ ] CRUD dan versioning System Prompt & Guardrails
- [ ] Pengaturan parameter model (temperature, top-p, context window)
- [ ] Sandbox playground interaktif untuk uji coba respons prompt`,
  },
  {
    title: "[Sprint 4] Knowledge Base Ingestion & Document Manager UI",
    body: `### Deskripsi
Antarmuka upload dokumen dan monitoring status indexing knowledge base.

### Subtasks
- [ ] Drag-and-drop uploader untuk file PDF, Markdown, CSV
- [ ] Web URL & sitemap crawler input
- [ ] Status visual indexing (Queued, Processing, Ready, Failed)`,
  },
  {
    title: "[Sprint 4] Live Visual Widget Theme Customizer (Whitelabel)",
    body: `### Deskripsi
Editor visual kustomisasi tema widget dengan live preview seketika.

### Subtasks
- [ ] Pengaturan warna tema utama, font, dan mode Light/Dark
- [ ] Upload avatar/logo bot, teks sambutan, posisi bubble launcher
- [ ] Export konfigurasi langsung ke database tenant`,
  },
  {
    title: "[Sprint 4] Real-Time Token Observability & Cost Analytics Dashboard",
    body: `### Deskripsi
Dashboard metrik analitik konsumsi token dan estimasi biaya per model.

### Subtasks
- [ ] Grafik token harian/bulanan (prompt vs completion vs cached tokens)
- [ ] Perhitungan estimasi biaya per tenant dan per model
- [ ] Konfigurasi threshold batas token & notifikasi alert`,
  },
  {
    title: "[Sprint 4] Human Handoff & Escalation Inbox",
    body: `### Deskripsi
Monitoring obrolan pengguna dan eskalasi otomatis ke tiket/agen manusia.

### Subtasks
- [ ] Inbox transkrip percakapan & filter flagged low-confidence answer
- [ ] Integrasi tombol operan ke sistem tiket (Zendesk / webhook / email)
- [ ] Analisis sentimen dan ringkasan CSAT`,
  },
  {
    title: "[Sprint 4] RBAC Team Access & API Key Security Management",
    body: `### Deskripsi
Manajemen keamanan kredensial dan hak akses multi-role di Admin Portal.

### Subtasks
- [ ] Generate & revoke API Secret Key per App ID
- [ ] Konfigurasi whitelist domain origin yang diizinkan
- [ ] Manajemen user tim dengan role-based access control
- [ ] Audit log immutable untuk setiap perubahan konfigurasi`,
  },
];

async function run() {
  console.log(`Starting automated issue creation and project sync...`);
  const ghPath = '"C:\\Program Files\\GitHub CLI\\gh.exe"';

  for (let i = 0; i < issues.length; i++) {
    const item = issues[i];
    console.log(`\n[${i + 1}/${issues.length}] Creating issue: ${item.title}`);

    // Create issue
    const createCmd = `${ghPath} issue create --repo ${REPO} --title "${item.title.replace(/"/g, '\\"')}" --body "${item.body.replace(/"/g, '\\"')}"`;
    const issueUrl = execSync(createCmd, { encoding: "utf-8" }).trim();
    console.log(`  Issue created: ${issueUrl}`);

    // Add to project
    console.log(`  Adding to project #${PROJECT_NUMBER}...`);
    const addCmd = `${ghPath} project item-add ${PROJECT_NUMBER} --owner ${OWNER} --url ${issueUrl}`;
    const result = execSync(addCmd, { encoding: "utf-8" }).trim();
    console.log(`  Project item added.`);
  }

  console.log(`\n🎉 All ${issues.length} backlog items successfully populated in GitHub Project #${PROJECT_NUMBER}!`);
}

run().catch((err) => {
  console.error("Execution failed:", err.message);
  process.exit(1);
});
