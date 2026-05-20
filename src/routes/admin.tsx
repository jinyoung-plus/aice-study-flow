import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/components/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: () => (<RequireAuth adminOnly><AdminPage /></RequireAuth>),
});

type Row = {
  id: string; nickname: string; is_admin: boolean; created_at: string;
  total: number; correct_rate: number; last_answered_at: string | null;
};

function AdminPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState<{ kind: "reset" | "delete"; target: Row } | null>(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("admin", {
      body: { action: "list", actor_id: user.id },
    });
    setLoading(false);
    if (error || (data as any)?.error) {
      toast.error("불러오기 실패");
      return;
    }
    setRows((data as any).users ?? []);
  }
  useEffect(() => { refresh(); }, [user?.id]);

  async function doAction() {
    if (!confirm || !user) return;
    setBusy(true);
    const { data, error } = await supabase.functions.invoke("admin", {
      body: { action: confirm.kind, actor_id: user.id, target_id: confirm.target.id },
    });
    setBusy(false);
    if (error || (data as any)?.error) {
      toast.error((data as any)?.error ?? error?.message ?? "실패");
      return;
    }
    toast.success(confirm.kind === "reset" ? "학습 이력을 초기화했습니다." : "사용자를 삭제했습니다.");
    setConfirm(null);
    refresh();
  }

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-bold text-slate-900">관리자 모드</h1>
          <span className="text-xs text-slate-500">{rows.length}명</span>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">별칭</th>
                <th className="px-4 py-3">가입일</th>
                <th className="px-4 py-3">마지막 학습일</th>
                <th className="px-4 py-3 text-right">풀이 수</th>
                <th className="px-4 py-3 text-right">평균 정답률</th>
                <th className="px-4 py-3 text-right">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">불러오는 중…</td></tr>
              )}
              {!loading && rows.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">사용자가 없습니다.</td></tr>
              )}
              {rows.map((r) => {
                const isSelf = r.id === user?.id;
                return (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {r.nickname}
                      {r.is_admin && <span className="ml-2 rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] text-indigo-700">admin</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{new Date(r.created_at).toLocaleDateString("ko-KR")}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {r.last_answered_at ? new Date(r.last_answered_at).toLocaleString("ko-KR") : "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-700">{r.total}</td>
                    <td className="px-4 py-3 text-right text-slate-700">{r.total ? `${r.correct_rate}%` : "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <button disabled={isSelf} onClick={() => setConfirm({ kind: "reset", target: r })}
                        className="mr-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-40">초기화</button>
                      <button disabled={isSelf} onClick={() => setConfirm({ kind: "delete", target: r })}
                        className="rounded-md border border-red-200 bg-white px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-40">삭제</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-lg">
            <h3 className="text-base font-semibold text-slate-900">
              {confirm.kind === "reset" ? "학습 이력 초기화" : "사용자 삭제"}
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              {confirm.kind === "reset"
                ? `${confirm.target.nickname} 님의 학습 이력을 모두 삭제하시겠습니까?`
                : `${confirm.target.nickname} 님의 계정과 모든 데이터를 삭제하시겠습니까?`}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setConfirm(null)}
                className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">취소</button>
              <button onClick={doAction} disabled={busy}
                className={`rounded-md px-3 py-1.5 text-sm font-medium text-white ${confirm.kind === "delete" ? "bg-red-600 hover:bg-red-700" : "bg-slate-900 hover:bg-slate-800"} disabled:opacity-50`}>
                {busy ? "처리 중…" : "확인"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
