// ═══════════════════════════════════════════════════════════════
// GET /api/scoring — List scoring requests for an org
// POST /api/scoring — Submit a new scoring request
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
    listScoringRequests,
    createScoringRequest,
    listUserOrgs,
} from "@/lib/supabase/db";
import type { RiskCategory } from "@/lib/types";

// Simulated scoring engine (Agent NEURON will replace this)
function simulateScore(): {
    score_value: number;
    probability_of_default: number;
    risk_category: RiskCategory;
    max_recommended_amount: number;
    recommended_term_months: number;
    recommended_interest_rate: number;
    components: Record<string, number>;
    explanation_text: string;
} {
    const score = Math.floor(Math.random() * 600 + 300); // 300-900
    const pd = Math.max(0, Math.min(1, 1 - score / 1000));

    let risk: RiskCategory = "medium";
    if (score >= 800) risk = "very_low";
    else if (score >= 650) risk = "low";
    else if (score >= 450) risk = "medium";
    else if (score >= 300) risk = "high";
    else risk = "very_high";

    const maxAmount = Math.round(score * 5000); // FCFA
    const term = score >= 600 ? 12 : score >= 400 ? 6 : 3;
    const rate = Math.max(5, 35 - score / 30);

    return {
        score_value: score,
        probability_of_default: Math.round(pd * 10000) / 10000,
        risk_category: risk,
        max_recommended_amount: maxAmount,
        recommended_term_months: term,
        recommended_interest_rate: Math.round(rate * 100) / 100,
        components: {
            pagerank_score: Math.round(Math.random() * 100) / 100,
            behavioral_score: Math.round(Math.random() * 100) / 100,
            temporal_score: Math.round(Math.random() * 100) / 100,
            stability_score: Math.round(Math.random() * 100) / 100,
            network_score: Math.round(Math.random() * 100) / 100,
        },
        explanation_text: `Score de ${score}/1000. Risque ${risk}. Montant max recommandé: ${maxAmount.toLocaleString()} FCFA sur ${term} mois à ${rate.toFixed(1)}%.`,
    };
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
    const orgId = searchParams.get("org_id");
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("per_page") || "20");
    const status = searchParams.get("status") || undefined;

    if (!orgId) {
        // Get first org for user
        const orgs = await listUserOrgs(user.id);
        if (orgs.length === 0) {
            return NextResponse.json({ data: [], total: 0, error: null });
        }
        const result = await listScoringRequests(orgs[0].org_id, page, perPage, status);
        return NextResponse.json({ ...result, error: null });
    }

    const result = await listScoringRequests(orgId, page, perPage, status);
    return NextResponse.json({ ...result, error: null });
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
    const { org_id, subject_name, subject_phone, subject_id_number, input_data, priority } = body;

    if (!org_id) {
        return NextResponse.json({ data: null, error: "org_id est requis" }, { status: 400 });
    }

    if (!subject_phone && !subject_name) {
        return NextResponse.json(
            { data: null, error: "subject_phone ou subject_name est requis" },
            { status: 400 }
        );
    }

    // Create the scoring request
    const startTime = Date.now();

    const scoringRequest = await createScoringRequest({
        org_id,
        requested_by: user.id,
        subject_name: subject_name || null,
        subject_phone: subject_phone || null,
        subject_id_number: subject_id_number || null,
        input_data: input_data || {},
        data_sources: ["momo", "airtime"],
        priority: priority || "normal",
        error_message: null,
        processing_time_ms: null,
        api_key_used: null,
        metadata: {},
    });

    if (!scoringRequest) {
        return NextResponse.json(
            { data: null, error: "Erreur lors de la création de la requête" },
            { status: 500 }
        );
    }

    // Simulate scoring (Agent NEURON will replace with real ML model)
    const scoreResult = simulateScore();
    const processingTime = Date.now() - startTime;

    // Update request status
    await supabase
        .from("cap_scoring_requests")
        .update({ status: "completed", processing_time_ms: processingTime })
        .eq("id", scoringRequest.id);

    // Insert the score
    const { data: score } = await supabase
        .from("cap_scores")
        .insert({
            request_id: scoringRequest.id,
            org_id,
            ...scoreResult,
            shap_explanation: {},
            model_version: "v1.0-demo",
            confidence: 0.85,
        })
        .select()
        .single();

    // Record billing event
    await supabase.from("cap_billing_events").insert({
        org_id,
        event_type: "scoring_request",
        quantity: 1,
        unit_price_fcfa: 500,
        total_price_fcfa: 500,
        description: `Scoring: ${subject_name || subject_phone}`,
    });

    return NextResponse.json(
        {
            data: { ...scoringRequest, status: "completed", score },
            error: null,
        },
        { status: 201 }
    );
}
