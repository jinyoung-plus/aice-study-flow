// Admin operations: list users with stats, reset a user's progress, delete a user.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders, json } from "../_shared/cors.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

async function requireAdmin(actor_id: string): Promise<boolean> {
  const { data } = await supabase.from("users").select("is_admin").eq("id", actor_id).maybeSingle();
  return !!data?.is_admin;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const body = await req.json();
    const { action, actor_id } = body;
    if (!actor_id) return json({ error: "actor_id required" }, 400);
    if (!(await requireAdmin(actor_id))) return json({ error: "forbidden" }, 403);

    if (action === "list") {
      const { data: users, error } = await supabase
        .from("users").select("id, nickname, is_admin, created_at")
        .order("created_at", { ascending: true });
      if (error) return json({ error: error.message }, 500);

      const { data: progress } = await supabase
        .from("user_progress").select("user_id,is_correct,answered_at");

      const stats = new Map<string, { total: number; correct: number; last: string | null }>();
      for (const p of progress ?? []) {
        const s = stats.get(p.user_id) ?? { total: 0, correct: 0, last: null };
        s.total++; if (p.is_correct) s.correct++;
        if (!s.last || p.answered_at > s.last) s.last = p.answered_at;
        stats.set(p.user_id, s);
      }

      const enriched = (users ?? []).map(u => {
        const s = stats.get(u.id) ?? { total: 0, correct: 0, last: null };
        return {
          ...u,
          total: s.total,
          correct_rate: s.total ? Math.round((s.correct / s.total) * 100) : 0,
          last_answered_at: s.last,
        };
      });
      return json({ users: enriched });
    }

    if (action === "reset") {
      const { target_id } = body;
      if (!target_id) return json({ error: "target_id required" }, 400);
      if (target_id === actor_id) return json({ error: "본인 계정에는 사용할 수 없습니다." }, 400);
      const { error } = await supabase.from("user_progress").delete().eq("user_id", target_id);
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    if (action === "delete") {
      const { target_id } = body;
      if (!target_id) return json({ error: "target_id required" }, 400);
      if (target_id === actor_id) return json({ error: "본인 계정은 삭제할 수 없습니다." }, 400);
      const { error } = await supabase.from("users").delete().eq("id", target_id);
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    return json({ error: "unknown action" }, 400);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
