// ═══════════════════════════════════════════════════════════════
// GET /api/scoring/[requestId] — Get scoring request with result
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getScoringRequest } from "@/lib/supabase/db";

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ requestId: string }> }
) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ data: null, error: "Non authentifié" }, { status: 401 });
    }

    const { requestId } = await params;
    const scoringRequest = await getScoringRequest(requestId);

    if (!scoringRequest) {
        return NextResponse.json(
            { data: null, error: "Requête de scoring non trouvée" },
            { status: 404 }
        );
    }

    return NextResponse.json({ data: scoringRequest, error: null });
}
