// ═══════════════════════════════════════════════════════════════
// GET /api/organizations/[orgId] — Get org details
// PUT /api/organizations/[orgId] — Update org
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getOrganization, updateOrganization } from "@/lib/supabase/db";

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ orgId: string }> }
) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ data: null, error: "Non authentifié" }, { status: 401 });
    }

    const { orgId } = await params;
    const org = await getOrganization(orgId);

    if (!org) {
        return NextResponse.json({ data: null, error: "Organisation non trouvée" }, { status: 404 });
    }

    return NextResponse.json({ data: org, error: null });
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ orgId: string }> }
) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ data: null, error: "Non authentifié" }, { status: 401 });
    }

    const { orgId } = await params;
    const body = await request.json();

    const allowedFields = ["name", "address", "website", "logo_url", "settings"];
    const updates: Record<string, unknown> = {};
    for (const key of allowedFields) {
        if (key in body) updates[key] = body[key];
    }

    const org = await updateOrganization(orgId, updates);

    if (!org) {
        return NextResponse.json({ data: null, error: "Erreur lors de la mise à jour" }, { status: 500 });
    }

    return NextResponse.json({ data: org, error: null });
}
