import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/components/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  ),
});

type Stage = { id: number; name: string; sort_order: number };
type Subtopic = { id: number; stage_id: number; name: string; hint: string | null; sort_order: number };
type Question = { id: number; subtopic_id: number };

function dayDiff(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, d + 1);
}

function Dashboard() {
  const { user } = useAuth();
  const [stages, setStages] = useState<Stage[]>([]);
  const [subs, setSubs] = useState<Subtopic[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [summary, setSummary] = useState<{
    total: number; correct: number; rate: number;
    subtopicProgress: Record<number, number>;
    answeredQuestionIds: number[];
  } | null>(null);

  useEffect(() => {
    (async () => {
      const [{ data: st }, { data: sb }, { data: qs }] = await Promise.all([
        supabase.from("stages").select("*").order("sort_order"),
        supabase.from("subtopics").select("*").order("sort_order"),
        supabase.from("questions").select("id, subtopic_id"),
      ]);
      setStages((st as Stage[]) ?? []);
      setSubs((sb as Subtopic[]) ?? []);
      setQuestions((qs as Question[]) ?? []);

      if (user) {
        const { data } = await supabase.functions.invoke("progress", {
          body: { action: "summary", user_id: user.id },
        });
        if (data) setSummary(data as any);
      }
    })();
  }, [user?.id]);

  const subsByStage = useMemo(() => {
    const m = new Map<number, Subtopic[]>();
    for (const s of subs) {
      if (!m.has(s.stage_id)) m.set(s.stage_id, []);
      m.get(s.stage_id)!.push(s);
    }
    return m;
  }, [subs]);

  const subDone = (subtopicId: number) => (summary?.subtopicProgress?.[subtopicId] ?? 0) > 0;

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900">안녕하세요, {user?.nickname} 님</h1>
        <p className="mt-1 text-sm text-slate-600">데이터 → 전처리 → 모델링 순서대로 따라가세요.</p>

        <section className="mt-6 grid gap-3 sm:grid-cols-3">
          <StatCard label="총 풀이 문제" value={`${summary?.total ?? 0}개`} />
          <StatCard label="평균 정답률" value={`${summary?.rate ?? 0}%`} />
          <StatCard label="학습 일수" value={`D+${user ? dayDiff(user.created_at) : 1}`} />
        </section>

        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">학습 단계</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {stages.map((stage) => {
              const items = subsByStage.get(stage.id) ?? [];
              const doneCount = items.filter((it) => subDone(it.id)).length;
              const total = items.length;
              const pct = total ? Math.round((doneCount / total) * 100) : 0;

              const firstUndone = items.find((it) => !subDone(it.id));
              const target = firstUndone ?? items[0];
              const label =
                doneCount === 0 ? "학습 시작" :
                doneCount < total ? "이어서 학습" : "복습";

              return (
                <div key={stage.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-base font-semibold text-slate-900">
                      {stage.sort_order}단계 {stage.name}
                    </h3>
                    <span className="text-xs text-slate-500">{doneCount} / {total} 완료</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-indigo-600 transition-all" style={{ width: `${pct}%` }} />
                  </div>

                  <ul className="mt-4 space-y-1.5">
                    {items.map((it) => {
                      const done = subDone(it.id);
                      return (
                        <li key={it.id}>
                          <Link
                            to="/learn/$subtopicId"
                            params={{ subtopicId: String(it.id) }}
                            className="group flex items-start gap-2 rounded-md px-2 py-1.5 hover:bg-slate-50"
                          >
                            <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] ${done ? "bg-indigo-600 text-white" : "border border-slate-300 text-slate-400"}`}>
                              {done ? "✓" : ""}
                            </span>
                            <span className="min-w-0">
                              <span className="block text-sm font-medium text-slate-800 group-hover:text-indigo-700">{it.name}</span>
                              {it.hint && <span className="block truncate text-xs text-slate-500">{it.hint}</span>}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>

                  {target && (
                    <Link
                      to="/learn/$subtopicId"
                      params={{ subtopicId: String(target.id) }}
                      className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                      {label}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
    </div>
  );
}
