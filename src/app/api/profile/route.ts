// ═══════════════════════════════════════════════════════════════
// GET /api/profile — Fetch current user profile
// PUT /api/profile — Update current user profile
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProfile, upsertProfile } from "@/lib/supabase/db";

export async function GET() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ data: null, error: "Non authentifié" }, { status: 401 });
    }

    const profile = await getProfile(user.id);
    return NextResponse.json({ data: profile, error: null });
}

export async function PUT(request: NextRequest) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ data: null, error: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();
    const allowedFields = [
        "full_name",
        "phone",
        "company_name",
        "job_title",
        "country",
        "preferred_language",
        "onboarded",
        "avatar_url",
    ];

    const updates: Record<string, unknown> = { email: user.email || "" };
    for (const key of allowedFields) {
        if (key in body) updates[key] = body[key];
    }

    const profile = await upsertProfile(user.id, updates);
    if (!profile) {
        return NextResponse.json({ data: null, error: "Erreur lors de la mise à jour" }, { status: 500 });
    }

    return NextResponse.json({ data: profile, error: null });
}
