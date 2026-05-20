import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/components/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export const Route = createFileRoute("/me")({
  component: () => (<RequireAuth><MePage /></RequireAuth>),
});

type Subtopic = { id: number; name: string; stage_id: number };
type Stage = { id: number; name: string; sort_order: number };

function MePage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<any>(null);
  const [subs, setSubs] = useState<Subtopic[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: sb }, { data: st }] = await Promise.all([
        supabase.from("subtopics").select("id,name,stage_id"),
        supabase.from("stages").select("*"),
      ]);
      setSubs((sb as Subtopic[]) ?? []);
      setStages((st as Stage[]) ?? []);
      const { data } = await supabase.functions.invoke("progress", {
        body: { action: "summary", user_id: user.id },
      });
      setSummary(data);
    })();
  }, [user?.id]);

  const chartData = useMemo(() => {
    if (!summary?.subtopicAccuracy) return [];
    return subs.map(s => ({
      name: s.name,
      rate: summary.subtopicAccuracy[s.id]?.rate ?? 0,
      total: summary.subtopicAccuracy[s.id]?.total ?? 0,
    })).filter(d => d.total > 0);
  }, [subs, summary]);

  const weak = useMemo(() => {
    if (!summary?.subtopicAccuracy) return [];
    return subs
      .map(s => ({ ...s, ...(summary.subtopicAccuracy[s.id] ?? { rate: null, total: 0 }) }))
      .filter(s => s.total >= 1 && s.rate != null)
      .sort((a, b) => (a.rate ?? 0) - (b.rate ?? 0))
      .slice(0, 2);
  }, [subs, summary]);

  const recent: any[] = summary?.recent ?? [];

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900">마이페이지</h1>
        <p className="mt-1 text-sm text-slate-600">{user?.nickname} 님의 학습 기록입니다.</p>

        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-base font-semibold text-slate-900">영역별 정답률</h2>
          {chartData.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-500">아직 풀이 기록이 없습니다.</p>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 40, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" interval={0} angle={-30} textAnchor="end" tick={{ fontSize: 11 }} height={60} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip />
                  <Bar dataKey="rate" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-slate-900">약점 영역 추천</h2>
            {weak.length === 0 ? (
              <p className="text-sm text-slate-500">데이터가 모이면 추천해 드릴게요.</p>
            ) : (
              <ul className="space-y-2">
                {weak.map(w => (
                  <li key={w.id}>
                    <Link to="/learn/$subtopicId" params={{ subtopicId: String(w.id) }}
                      className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 hover:bg-amber-100">
                      <span className="text-sm font-medium text-amber-900">{w.name}</span>
                      <span className="text-xs text-amber-800">정답률 {w.rate}%</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-slate-900">최근 풀이 기록</h2>
            {recent.length === 0 ? (
              <p className="text-sm text-slate-500">아직 기록이 없습니다.</p>
            ) : (
              <ul className="divide-y divide-slate-100 text-sm">
                {recent.map((r) => (
                  <li key={r.id} className="flex items-start gap-3 py-2">
                    <span className={`mt-1 inline-block h-2 w-2 shrink-0 rounded-full ${r.is_correct ? "bg-green-500" : "bg-red-400"}`} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-slate-800">{r.questions?.question_text}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {r.questions?.subtopics?.stages?.name} · {r.questions?.subtopics?.name} ·{" "}
                        {new Date(r.answered_at).toLocaleString("ko-KR")}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
