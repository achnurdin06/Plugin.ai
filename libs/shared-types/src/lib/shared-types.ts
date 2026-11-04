export type Role = 'SUPER_ADMIN' | 'PROMPT_ENGINEER' | 'SUPPORT_AGENT' | 'VIEWER';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: Role;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppCredential {
  id: string;
  tenantId: string;
  appKey: string;
  secretHash: string;
  allowedDomains: string[];
  isActive: boolean;
  rateLimitRpm: number;
  rateLimitTpm: number;
  createdAt: string;
}

export interface PromptVersion {
  id: string;
  tenantId: string;
  version: number;
  systemPrompt: string;
  guardrails: string[];
  temperature: number;
  topP: number;
  maxTokens: number;
  model: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

export interface KnowledgeDocument {
  id: string;
  tenantId: string;
  title: string;
  sourceUrl?: string;
  fileType: 'PDF' | 'MARKDOWN' | 'DOCX' | 'WEBPAGE' | 'CSV';
  status: 'QUEUED' | 'PROCESSING' | 'READY' | 'FAILED';
  chunkCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface VectorChunk {
  id: string;
  documentId: string;
  tenantId: string;
  content: string;
  metadata: Record<string, unknown>;
  embedding?: number[];
  chunkIndex: number;
}

export interface ChatSession {
  id: string;
  tenantId: string;
  appKey: string;
  visitorId: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tokenCount?: number;
  cached?: boolean;
  createdAt: string;
}

export interface TokenConsumptionLog {
  id: string;
  tenantId: string;
  appKey: string;
  provider: 'openai' | 'anthropic' | 'gemini' | 'groq';
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  cached: boolean;
  createdAt: string;
}

export interface FeedbackCSAT {
  id: string;
  sessionId: string;
  tenantId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  tenantId: string;
  userId: string;
  action: string;
  target: string;
  details?: Record<string, unknown>;
  createdAt: string;
}
