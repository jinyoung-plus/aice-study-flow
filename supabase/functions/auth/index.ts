// Custom auth (nickname + 4-digit pw) using pgcrypto. No Supabase Auth.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders, json } from "../_shared/cors.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { action, nickname, password } = await req.json();
    if (!action) return json({ error: "action required" }, 400);
    const nick = String(nickname ?? "").trim();
    const pw = String(password ?? "");

    if (!nick) return json({ error: "별칭을 입력해 주세요." }, 400);
    if (!/^\d{4}$/.test(pw)) return json({ error: "비밀번호는 숫자 4자리여야 합니다." }, 400);
    if (nick.length > 30) return json({ error: "별칭은 30자 이하로 입력해 주세요." }, 400);

    if (action === "signup") {
      const { data: exists } = await supabase.from("users").select("id").eq("nickname", nick).maybeSingle();
      if (exists) return json({ error: "이미 사용 중인 별칭입니다" }, 409);

      // Hash via SQL using pgcrypto
      const { data: hashRow, error: hashErr } = await supabase
        .rpc("hash_password", { pw }) as any;
      // Fallback: use raw SQL via PostgREST is not available; use a helper function we'll create, OR insert with a SQL expression via raw query.
      // Simpler: call PostgREST RPC - we created none. Instead use the SQL editor pattern: insert with select crypt().
      // Use a postgres function we'll create on the fly via a stored procedure won't work without migration.
      // Workaround: hash in Deno using bcrypt.
      let password_hash: string;
      if (hashErr || !hashRow) {
        const bcrypt = await import("https://deno.land/x/bcrypt@v0.4.1/mod.ts");
        password_hash = await bcrypt.hash(pw);
      } else {
        password_hash = hashRow as string;
      }

      const { data: created, error: insErr } = await supabase
        .from("users")
        .insert({ nickname: nick, password_hash, is_admin: false })
        .select("id, nickname, is_admin, created_at")
        .single();
      if (insErr) return json({ error: insErr.message }, 500);
      return json({ user: created });
    }

    if (action === "login") {
      const { data: u, error } = await supabase
        .from("users")
        .select("id, nickname, is_admin, password_hash, created_at")
        .eq("nickname", nick)
        .maybeSingle();
      if (error) return json({ error: error.message }, 500);
      if (!u) return json({ error: "별칭 또는 비밀번호가 올바르지 않습니다." }, 401);

      const bcrypt = await import("https://deno.land/x/bcrypt@v0.4.1/mod.ts");
      const ok = await bcrypt.compare(pw, u.password_hash);
      if (!ok) return json({ error: "별칭 또는 비밀번호가 올바르지 않습니다." }, 401);

      return json({
        user: { id: u.id, nickname: u.nickname, is_admin: u.is_admin, created_at: u.created_at },
      });
    }

    return json({ error: "unknown action" }, 400);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
