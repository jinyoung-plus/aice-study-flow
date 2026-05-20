// User progress: insert an answer, list recent, compute stats for current user.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders, json } from "../_shared/cors.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

async function ensureUser(user_id: string) {
  const { data } = await supabase.from("users").select("id").eq("id", user_id).maybeSingle();
  return !!data;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const body = await req.json();
    const { action, user_id } = body;
    if (!user_id || typeof user_id !== "string") return json({ error: "user_id required" }, 400);
    if (!(await ensureUser(user_id))) return json({ error: "invalid user" }, 401);

    if (action === "insert") {
      const { question_id, is_correct, user_answer } = body;
      if (typeof question_id !== "number" || typeof is_correct !== "boolean")
        return json({ error: "question_id and is_correct required" }, 400);
      const { error } = await supabase.from("user_progress").insert({
        user_id, question_id, is_correct,
        user_answer: typeof user_answer === "string" ? user_answer : null,
      });
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    if (action === "summary") {
      // Returns: totals + per-subtopic completion + per-stage rate
      const { data: progress, error } = await supabase
        .from("user_progress")
        .select("id,is_correct,question_id,answered_at")
        .eq("user_id", user_id);
      if (error) return json({ error: error.message }, 500);

      const total = progress?.length ?? 0;
      const correct = progress?.filter(p => p.is_correct).length ?? 0;
      const rate = total ? Math.round((correct / total) * 100) : 0;

      // Distinct question ids answered
      const answeredQids = new Set((progress ?? []).map(p => p.question_id));

      // Per-subtopic: any question answered → in-progress
      const { data: questions } = await supabase
        .from("questions").select("id, subtopic_id");
      const subAnswered = new Map<number, Set<number>>(); // subtopic -> question ids answered
      for (const q of questions ?? []) {
        if (answeredQids.has(q.id)) {
          if (!subAnswered.has(q.subtopic_id)) subAnswered.set(q.subtopic_id, new Set());
          subAnswered.get(q.subtopic_id)!.add(q.id);
        }
      }
      const subtopicProgress: Record<number, number> = {};
      subAnswered.forEach((set, sid) => { subtopicProgress[sid] = set.size; });

      // Recent 20
      const { data: recent } = await supabase
        .from("user_progress")
        .select("id,is_correct,user_answer,answered_at,question_id,questions(question_text,subtopic_id,subtopics(name,stage_id,stages(name)))")
        .eq("user_id", user_id)
        .order("answered_at", { ascending: false })
        .limit(20);

      // Per-subtopic accuracy
      const subAccMap = new Map<number, { c: number; t: number }>();
      for (const p of progress ?? []) {
        const q = (questions ?? []).find(x => x.id === p.question_id);
        if (!q) continue;
        const m = subAccMap.get(q.subtopic_id) ?? { c: 0, t: 0 };
        m.t++; if (p.is_correct) m.c++;
        subAccMap.set(q.subtopic_id, m);
      }
      const subtopicAccuracy: Record<number, { correct: number; total: number; rate: number }> = {};
      subAccMap.forEach((v, k) => {
        subtopicAccuracy[k] = { correct: v.c, total: v.t, rate: v.t ? Math.round((v.c / v.t) * 100) : 0 };
      });

      return json({
        total, correct, rate,
        answeredQuestionIds: Array.from(answeredQids),
        subtopicProgress, subtopicAccuracy,
        recent: recent ?? [],
      });
    }

    return json({ error: "unknown action" }, 400);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
