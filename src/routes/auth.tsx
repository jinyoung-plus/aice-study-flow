import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { useAuth } from "@/components/AuthContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({ component: AuthPage });

function AuthPage() {
  const { user, signup, login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signup" | "login">("login");
  const [nickname, setNickname] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: user.is_admin ? "/admin" : "/dashboard" });
  }, [user, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{4}$/.test(pw)) {
      toast.error("비밀번호는 숫자 4자리여야 합니다.");
      return;
    }
    if (mode === "signup" && pw !== pw2) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }
    setBusy(true);
    const fn = mode === "signup" ? signup : login;
    const { error } = await fn(nickname, pw);
    setBusy(false);
    if (error) toast.error(error);
    else toast.success(mode === "signup" ? "가입 완료!" : "로그인 완료");
  }

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto flex max-w-md flex-col px-4 py-10">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 grid grid-cols-2 rounded-lg bg-slate-100 p-1 text-sm">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`rounded-md py-2 font-medium transition ${mode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
            >로그인</button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`rounded-md py-2 font-medium transition ${mode === "signup" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
            >가입</button>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">별칭</label>
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="가명을 사용해 주세요"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                required
                maxLength={30}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">비밀번호 (숫자 4자리)</label>
              <input
                value={pw}
                onChange={(e) => setPw(e.target.value.replace(/\D/g, "").slice(0, 4))}
                inputMode="numeric"
                type="password"
                pattern="\d{4}"
                maxLength={4}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm tracking-widest outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                required
              />
            </div>
            {mode === "signup" && (
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">비밀번호 확인</label>
                <input
                  value={pw2}
                  onChange={(e) => setPw2(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  inputMode="numeric"
                  type="password"
                  maxLength={4}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm tracking-widest outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  required
                />
              </div>
            )}
            <button
              type="submit"
              disabled={busy}
              className="mt-2 w-full rounded-md bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {busy ? "처리 중…" : (mode === "signup" ? "가입하기" : "로그인")}
            </button>
          </form>

          <p className="mt-5 rounded-md bg-slate-50 p-3 text-xs leading-5 text-slate-600">
            <strong className="text-slate-800">비밀번호 복구 안내</strong>
            <br />
            라이트 식별 방식이라 비밀번호 복구가 없습니다. 분실 시 새 별칭으로 다시 가입해 주세요.
          </p>
        </div>
      </main>
    </div>
  );
}
