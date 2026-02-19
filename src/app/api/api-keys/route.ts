// ═══════════════════════════════════════════════════════════════
// GET /api/api-keys — List org API keys
// POST /api/api-keys — Create a new API key
// DELETE /api/api-keys — Deactivate an API key
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
    listApiKeys,
    createApiKey,
    deactivateApiKey,
    listUserOrgs,
} from "@/lib/supabase/db";
import crypto from "crypto";

function generateApiKey(): { raw: string; prefix: string; hash: string } {
    const raw = `cap_${crypto.randomBytes(32).toString("hex")}`;
    const prefix = raw.substring(0, 12) + "...";
    const hash = crypto.createHash("sha256").update(raw).digest("hex");
    return { raw, prefix, hash };
}

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

    if (!orgId) {
        const orgs = await listUserOrgs(user.id);
        if (orgs.length === 0) {
            return NextResponse.json({ data: [], error: null });
        }
        orgId = orgs[0].org_id;
    }

    const keys = await listApiKeys(orgId);
    return NextResponse.json({ data: keys, error: null });
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
    const { org_id, name, scopes } = body;

    if (!org_id || !name) {
        return NextResponse.json(
            { data: null, error: "org_id et name sont requis" },
            { status: 400 }
        );
    }

    const { raw, prefix, hash } = generateApiKey();

    const apiKey = await createApiKey(
        org_id,
        user.id,
        name,
        prefix,
        hash,
        scopes || ["scoring:read", "scoring:write"]
    );

    if (!apiKey) {
        return NextResponse.json(
            { data: null, error: "Erreur lors de la création de la clé" },
            { status: 500 }
        );
    }

    // Return the raw key ONLY on creation (never stored, never returned again)
    return NextResponse.json(
        {
            data: { ...apiKey, raw_key: raw },
            error: null,
            warning: "Conservez cette clé en lieu sûr. Elle ne sera plus affichée.",
        },
        { status: 201 }
    );
}

export async function DELETE(request: NextRequest) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ data: null, error: "Non authentifié" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const keyId = searchParams.get("key_id");

    if (!keyId) {
        return NextResponse.json(
            { data: null, error: "key_id est requis" },
            { status: 400 }
        );
    }

    const success = await deactivateApiKey(keyId);

    if (!success) {
        return NextResponse.json(
            { data: null, error: "Erreur lors de la désactivation" },
            { status: 500 }
        );
    }

    return NextResponse.json({ data: { id: keyId, is_active: false }, error: null });
}
