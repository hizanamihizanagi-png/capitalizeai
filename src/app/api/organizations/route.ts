// ═══════════════════════════════════════════════════════════════
// GET /api/organizations — List user's organizations
// POST /api/organizations — Create a new organization
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { listUserOrgs, createOrganization } from "@/lib/supabase/db";

export async function GET() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ data: null, error: "Non authentifié" }, { status: 401 });
    }

    const orgs = await listUserOrgs(user.id);
    return NextResponse.json({ data: orgs, error: null });
}

export async function POST(request: NextRequest) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ data: null, error: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();
    const { name, type } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
        return NextResponse.json(
            { data: null, error: "Le nom de l'organisation est requis (min 2 caractères)" },
            { status: 400 }
        );
    }

    // Generate slug from name
    const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 50);

    const org = await createOrganization(name.trim(), slug, user.id, type || "imf");

    if (!org) {
        return NextResponse.json(
            { data: null, error: "Erreur lors de la création. Le slug existe peut-être déjà." },
            { status: 500 }
        );
    }

    return NextResponse.json({ data: org, error: null }, { status: 201 });
}
