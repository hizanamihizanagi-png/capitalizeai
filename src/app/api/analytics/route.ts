// ═══════════════════════════════════════════════════════════════
// GET /api/analytics — Dashboard analytics for an org
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDashboardStats, listUserOrgs } from "@/lib/supabase/db";

export async function GET(request: NextRequest) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ data: null, error: "Non authentifié" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    let orgId = searchParams.get("org_id");

    // If no org_id provided, use the first org
    if (!orgId) {
        const orgs = await listUserOrgs(user.id);
        if (orgs.length === 0) {
            return NextResponse.json({
                data: {
                    total_scorings: 0,
                    avg_score: 0,
                    scorings_this_month: 0,
                    scorings_trend: 0,
                    default_rate: 0,
                    total_amount_scored: 0,
                    score_distribution: [],
                    recent_activity: [],
                    risk_breakdown: [],
                },
                error: null,
            });
        }
        orgId = orgs[0].org_id;
    }

    const stats = await getDashboardStats(orgId);
    return NextResponse.json({ data: stats, error: null });
}
