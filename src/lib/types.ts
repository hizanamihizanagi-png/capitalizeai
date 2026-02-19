// ═══════════════════════════════════════════════════════════════
// CapitalizeAI — TypeScript Types (matching Supabase cap_ schema)
// ═══════════════════════════════════════════════════════════════

// ── Profile ─────────────────────────────────────────────────
export interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    phone: string | null;
    company_name: string | null;
    job_title: string | null;
    country: string;
    preferred_language: string;
    onboarded: boolean;
    metadata: Record<string, unknown>;
    created_at: string;
    updated_at: string;
}

// ── Organization ────────────────────────────────────────────
export type OrgType = "imf" | "bank" | "fintech" | "telecom" | "government" | "other";
export type OrgPlan = "starter" | "pro" | "enterprise" | "custom";
export type OrgStatus = "active" | "suspended" | "trial" | "cancelled";

export interface Organization {
    id: string;
    name: string;
    slug: string;
    type: OrgType;
    plan: OrgPlan;
    country: string;
    address: string | null;
    website: string | null;
    logo_url: string | null;
    settings: Record<string, unknown>;
    quotas: OrgQuotas;
    usage_current: OrgUsage;
    status: OrgStatus;
    trial_ends_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface OrgQuotas {
    max_scorings_per_month: number;
    max_api_keys: number;
    max_members: number;
}

export interface OrgUsage {
    scorings_this_month: number;
    api_calls_this_month: number;
}

// ── Org Member ──────────────────────────────────────────────
export type MemberRole = "owner" | "admin" | "analyst" | "member" | "viewer";

export interface OrgMember {
    id: string;
    user_id: string;
    org_id: string;
    role: MemberRole;
    invited_by: string | null;
    joined_at: string;
    // Joined fields
    profile?: Profile;
    organization?: Organization;
}

// ── Scoring Request ─────────────────────────────────────────
export type ScoringStatus = "pending" | "processing" | "completed" | "failed" | "expired";
export type ScoringPriority = "low" | "normal" | "high" | "urgent";

export interface ScoringRequest {
    id: string;
    org_id: string;
    requested_by: string | null;
    subject_name: string | null;
    subject_phone: string | null;
    subject_id_number: string | null;
    input_data: Record<string, unknown>;
    data_sources: string[];
    status: ScoringStatus;
    priority: ScoringPriority;
    error_message: string | null;
    processing_time_ms: number | null;
    api_key_used: string | null;
    metadata: Record<string, unknown>;
    created_at: string;
    updated_at: string;
    // Joined
    score?: Score;
}

// ── Score ────────────────────────────────────────────────────
export type RiskCategory = "very_low" | "low" | "medium" | "high" | "very_high";

export interface Score {
    id: string;
    request_id: string;
    org_id: string;
    score_value: number;
    probability_of_default: number | null;
    risk_category: RiskCategory | null;
    max_recommended_amount: number | null;
    recommended_term_months: number | null;
    recommended_interest_rate: number | null;
    components: ScoreComponents;
    shap_explanation: Record<string, unknown>;
    explanation_text: string | null;
    model_version: string;
    confidence: number;
    valid_until: string;
    created_at: string;
}

export interface ScoreComponents {
    pagerank_score?: number;
    behavioral_score?: number;
    temporal_score?: number;
    stability_score?: number;
    network_score?: number;
    [key: string]: number | undefined;
}

// ── Transaction ─────────────────────────────────────────────
export type TransactionType = "send" | "receive" | "payment" | "withdrawal" | "deposit" | "airtime" | "bill" | "merchant";
export type Channel = "momo" | "orange_money" | "bank" | "visa" | "cash" | "other";

export interface Transaction {
    id: string;
    org_id: string;
    subject_phone: string;
    transaction_type: TransactionType | null;
    amount: number;
    currency: string;
    counterparty_phone: string | null;
    counterparty_name: string | null;
    channel: Channel;
    reference: string | null;
    location: string | null;
    timestamp: string;
    metadata: Record<string, unknown>;
    created_at: string;
}

// ── API Key ─────────────────────────────────────────────────
export interface ApiKey {
    id: string;
    org_id: string;
    created_by: string | null;
    name: string;
    key_prefix: string;
    scopes: string[];
    rate_limit_per_minute: number;
    last_used_at: string | null;
    usage_count: number;
    is_active: boolean;
    expires_at: string | null;
    created_at: string;
}

// ── Billing Event ───────────────────────────────────────────
export type BillingEventType = "scoring_request" | "api_call" | "batch_upload" | "export" | "plan_change" | "payment" | "refund";

export interface BillingEvent {
    id: string;
    org_id: string;
    event_type: BillingEventType;
    quantity: number;
    unit_price_fcfa: number;
    total_price_fcfa: number;
    currency: string;
    description: string | null;
    metadata: Record<string, unknown>;
    created_at: string;
}

// ── Dashboard Analytics ─────────────────────────────────────
export interface DashboardStats {
    total_scorings: number;
    avg_score: number;
    scorings_this_month: number;
    scorings_trend: number; // % change
    default_rate: number;
    total_amount_scored: number;
    score_distribution: { range: string; count: number }[];
    recent_activity: ActivityItem[];
    risk_breakdown: { category: RiskCategory; count: number; percentage: number }[];
}

export interface ActivityItem {
    id: string;
    type: "scoring" | "member" | "api_key" | "billing";
    title: string;
    description: string;
    timestamp: string;
    icon?: string;
}

// ── API Response Wrappers ───────────────────────────────────
export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    status: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    per_page: number;
    has_more: boolean;
}
