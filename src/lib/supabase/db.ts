// ═══════════════════════════════════════════════════════════════
// CapitalizeAI — Server-side Data Access Layer
// ═══════════════════════════════════════════════════════════════

import { createClient } from "./server";
import type {
    Profile,
    Organization,
    OrgMember,
    ScoringRequest,
    Score,
    ApiKey,
    BillingEvent,
    Transaction,
} from "../types";

// ── Helpers ─────────────────────────────────────────────────

async function getSupabase() {
    return await createClient();
}

// ── Profile ─────────────────────────────────────────────────

export async function getProfile(userId: string): Promise<Profile | null> {
    const supabase = await getSupabase();
    const { data, error } = await supabase
        .from("cap_profiles")
        .select("*")
        .eq("id", userId)
        .single();

    if (error) return null;
    return data as Profile;
}

export async function upsertProfile(
    userId: string,
    updates: Partial<Profile>
): Promise<Profile | null> {
    const supabase = await getSupabase();
    const { data, error } = await supabase
        .from("cap_profiles")
        .upsert({ id: userId, ...updates }, { onConflict: "id" })
        .select()
        .single();

    if (error) return null;
    return data as Profile;
}

// ── Organization ────────────────────────────────────────────

export async function getOrganization(orgId: string): Promise<Organization | null> {
    const supabase = await getSupabase();
    const { data, error } = await supabase
        .from("cap_organizations")
        .select("*")
        .eq("id", orgId)
        .single();

    if (error) return null;
    return data as Organization;
}

export async function listUserOrgs(userId: string): Promise<(OrgMember & { organization: Organization })[]> {
    const supabase = await getSupabase();
    const { data, error } = await supabase
        .from("cap_org_members")
        .select("*, organization:cap_organizations(*)")
        .eq("user_id", userId);

    if (error) return [];
    return data as (OrgMember & { organization: Organization })[];
}

export async function createOrganization(
    name: string,
    slug: string,
    ownerId: string,
    type: string = "imf"
): Promise<Organization | null> {
    const supabase = await getSupabase();

    // Create the org
    const { data: org, error: orgError } = await supabase
        .from("cap_organizations")
        .insert({ name, slug, type })
        .select()
        .single();

    if (orgError || !org) return null;

    // Add the creator as owner
    await supabase.from("cap_org_members").insert({
        user_id: ownerId,
        org_id: org.id,
        role: "owner",
    });

    return org as Organization;
}

export async function updateOrganization(
    orgId: string,
    updates: Partial<Organization>
): Promise<Organization | null> {
    const supabase = await getSupabase();
    const { data, error } = await supabase
        .from("cap_organizations")
        .update(updates)
        .eq("id", orgId)
        .select()
        .single();

    if (error) return null;
    return data as Organization;
}

// ── Scoring Requests ────────────────────────────────────────

export async function createScoringRequest(
    input: Omit<ScoringRequest, "id" | "created_at" | "updated_at" | "status">
): Promise<ScoringRequest | null> {
    const supabase = await getSupabase();
    const { data, error } = await supabase
        .from("cap_scoring_requests")
        .insert(input)
        .select()
        .single();

    if (error) return null;
    return data as ScoringRequest;
}

export async function getScoringRequest(requestId: string): Promise<ScoringRequest | null> {
    const supabase = await getSupabase();
    const { data, error } = await supabase
        .from("cap_scoring_requests")
        .select("*, score:cap_scores(*)")
        .eq("id", requestId)
        .single();

    if (error) return null;
    return data as ScoringRequest;
}

export async function listScoringRequests(
    orgId: string,
    page = 1,
    perPage = 20,
    status?: string
): Promise<{ data: ScoringRequest[]; total: number }> {
    const supabase = await getSupabase();
    let query = supabase
        .from("cap_scoring_requests")
        .select("*, score:cap_scores(*)", { count: "exact" })
        .eq("org_id", orgId)
        .order("created_at", { ascending: false })
        .range((page - 1) * perPage, page * perPage - 1);

    if (status) query = query.eq("status", status);

    const { data, count, error } = await query;
    if (error) return { data: [], total: 0 };
    return { data: (data || []) as ScoringRequest[], total: count || 0 };
}

// ── Scores ──────────────────────────────────────────────────

export async function getScore(requestId: string): Promise<Score | null> {
    const supabase = await getSupabase();
    const { data, error } = await supabase
        .from("cap_scores")
        .select("*")
        .eq("request_id", requestId)
        .single();

    if (error) return null;
    return data as Score;
}

export async function listScores(
    orgId: string,
    page = 1,
    perPage = 20
): Promise<{ data: Score[]; total: number }> {
    const supabase = await getSupabase();
    const { data, count, error } = await supabase
        .from("cap_scores")
        .select("*", { count: "exact" })
        .eq("org_id", orgId)
        .order("created_at", { ascending: false })
        .range((page - 1) * perPage, page * perPage - 1);

    if (error) return { data: [], total: 0 };
    return { data: (data || []) as Score[], total: count || 0 };
}

// ── API Keys ────────────────────────────────────────────────

export async function listApiKeys(orgId: string): Promise<ApiKey[]> {
    const supabase = await getSupabase();
    const { data, error } = await supabase
        .from("cap_api_keys")
        .select("*")
        .eq("org_id", orgId)
        .order("created_at", { ascending: false });

    if (error) return [];
    return data as ApiKey[];
}

export async function createApiKey(
    orgId: string,
    createdBy: string,
    name: string,
    keyPrefix: string,
    keyHash: string,
    scopes: string[] = ["scoring:read", "scoring:write"]
): Promise<ApiKey | null> {
    const supabase = await getSupabase();
    const { data, error } = await supabase
        .from("cap_api_keys")
        .insert({
            org_id: orgId,
            created_by: createdBy,
            name,
            key_prefix: keyPrefix,
            key_hash: keyHash,
            scopes,
        })
        .select()
        .single();

    if (error) return null;
    return data as ApiKey;
}

export async function deactivateApiKey(keyId: string): Promise<boolean> {
    const supabase = await getSupabase();
    const { error } = await supabase
        .from("cap_api_keys")
        .update({ is_active: false })
        .eq("id", keyId);

    return !error;
}

// ── Billing Events ──────────────────────────────────────────

export async function recordBillingEvent(
    event: Omit<BillingEvent, "id" | "created_at">
): Promise<BillingEvent | null> {
    const supabase = await getSupabase();
    const { data, error } = await supabase
        .from("cap_billing_events")
        .insert(event)
        .select()
        .single();

    if (error) return null;
    return data as BillingEvent;
}

export async function getUsageSummary(
    orgId: string,
    startDate?: string
): Promise<{ total_events: number; total_cost_fcfa: number; by_type: Record<string, number> }> {
    const supabase = await getSupabase();
    let query = supabase
        .from("cap_billing_events")
        .select("event_type, quantity, total_price_fcfa")
        .eq("org_id", orgId);

    if (startDate) query = query.gte("created_at", startDate);

    const { data, error } = await query;
    if (error || !data) return { total_events: 0, total_cost_fcfa: 0, by_type: {} };

    const byType: Record<string, number> = {};
    let totalCost = 0;

    for (const row of data) {
        byType[row.event_type] = (byType[row.event_type] || 0) + row.quantity;
        totalCost += row.total_price_fcfa;
    }

    return { total_events: data.length, total_cost_fcfa: totalCost, by_type: byType };
}

// ── Transactions ────────────────────────────────────────────

export async function insertTransactions(
    transactions: Omit<Transaction, "id" | "created_at">[]
): Promise<number> {
    const supabase = await getSupabase();
    const { data, error } = await supabase
        .from("cap_transactions")
        .insert(transactions)
        .select("id");

    if (error) return 0;
    return data?.length || 0;
}

export async function getTransactionStats(
    orgId: string,
    subjectPhone: string
): Promise<{
    total_transactions: number;
    total_sent: number;
    total_received: number;
    avg_amount: number;
    unique_counterparties: number;
}> {
    const supabase = await getSupabase();
    const { data, error } = await supabase
        .from("cap_transactions")
        .select("transaction_type, amount, counterparty_phone")
        .eq("org_id", orgId)
        .eq("subject_phone", subjectPhone);

    if (error || !data)
        return {
            total_transactions: 0,
            total_sent: 0,
            total_received: 0,
            avg_amount: 0,
            unique_counterparties: 0,
        };

    const totalSent = data
        .filter((t) => t.transaction_type === "send")
        .reduce((sum, t) => sum + t.amount, 0);
    const totalReceived = data
        .filter((t) => t.transaction_type === "receive")
        .reduce((sum, t) => sum + t.amount, 0);
    const avgAmount = data.length > 0 ? data.reduce((sum, t) => sum + t.amount, 0) / data.length : 0;
    const uniqueCounterparties = new Set(data.map((t) => t.counterparty_phone).filter(Boolean)).size;

    return {
        total_transactions: data.length,
        total_sent: totalSent,
        total_received: totalReceived,
        avg_amount: Math.round(avgAmount),
        unique_counterparties: uniqueCounterparties,
    };
}

// ── Dashboard Analytics ─────────────────────────────────────

export async function getDashboardStats(orgId: string) {
    const supabase = await getSupabase();

    // Get all scores for this org
    const { data: scores } = await supabase
        .from("cap_scores")
        .select("score_value, risk_category, max_recommended_amount, created_at")
        .eq("org_id", orgId);

    // Get recent scoring requests
    const { data: recentRequests } = await supabase
        .from("cap_scoring_requests")
        .select("id, subject_name, status, created_at")
        .eq("org_id", orgId)
        .order("created_at", { ascending: false })
        .limit(10);

    const allScores = scores || [];
    const avgScore =
        allScores.length > 0
            ? Math.round(allScores.reduce((s, r) => s + r.score_value, 0) / allScores.length)
            : 0;

    // Score distribution buckets
    const buckets = ["0-200", "201-400", "401-600", "601-800", "801-1000"];
    const distribution = buckets.map((range) => {
        const [lo, hi] = range.split("-").map(Number);
        return {
            range,
            count: allScores.filter((s) => s.score_value >= lo && s.score_value <= hi).length,
        };
    });

    // Risk breakdown
    const riskCategories: Array<"very_low" | "low" | "medium" | "high" | "very_high"> = [
        "very_low",
        "low",
        "medium",
        "high",
        "very_high",
    ];
    const riskBreakdown = riskCategories.map((cat) => {
        const count = allScores.filter((s) => s.risk_category === cat).length;
        return {
            category: cat,
            count,
            percentage: allScores.length > 0 ? Math.round((count / allScores.length) * 100) : 0,
        };
    });

    // Total amount scored
    const totalAmountScored = allScores.reduce(
        (sum, s) => sum + (s.max_recommended_amount || 0),
        0
    );

    // Default rate (high + very_high)
    const highRiskCount = allScores.filter(
        (s) => s.risk_category === "high" || s.risk_category === "very_high"
    ).length;
    const defaultRate = allScores.length > 0 ? Math.round((highRiskCount / allScores.length) * 100) : 0;

    // Recent activity
    const activity = (recentRequests || []).map((r) => ({
        id: r.id,
        type: "scoring" as const,
        title: `Scoring: ${r.subject_name || "Anonyme"}`,
        description: `Statut: ${r.status}`,
        timestamp: r.created_at,
    }));

    return {
        total_scorings: allScores.length,
        avg_score: avgScore,
        scorings_this_month: allScores.filter((s) => {
            const d = new Date(s.created_at);
            const now = new Date();
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length,
        scorings_trend: 0,
        default_rate: defaultRate,
        total_amount_scored: totalAmountScored,
        score_distribution: distribution,
        recent_activity: activity,
        risk_breakdown: riskBreakdown,
    };
}
