import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/components/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Markdown } from "@/components/Markdown";
import { toast } from "sonner";

export const Route = createFileRoute("/learn/$subtopicId")({
  component: () => (
    <RequireAuth>
      <Learn />
    </RequireAuth>
  ),
});

type Subtopic = { id: number; name: string; hint: string | null; stage_id: number };
type Stage = { id: number; name: string; sort_order: number };
type Question = {
  id: number; type: "fill_blank" | "quiz";
  question_text: string; correct_answer: string;
  options: string[] | null; explanation: string | null;
};
type Flashcard = { id: number; front_text: string; back_text: string };
type Cheatsheet = { id: number; title: string; content_markdown: string; sort_order: number };

const TABS = [
  { k: "cheatsheet", label: "📚 치트시트" },
  { k: "flashcard", label: "🎴 플래시카드" },
  { k: "fill", label: "✏️ 빈칸채우기" },
  { k: "quiz", label: "🧠 퀴즈" },
] as const;
type TabKey = typeof TABS[number]["k"];

function Learn() {
  const { user } = useAuth();
  const { subtopicId } = useParams({ from: "/learn/$subtopicId" });
  const sid = Number(subtopicId);
  const [tab, setTab] = useState<TabKey>("cheatsheet");
  const [sub, setSub] = useState<Subtopic | null>(null);
  const [stage, setStage] = useState<Stage | null>(null);
  const [cheats, setCheats] = useState<Cheatsheet[]>([]);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [fills, setFills] = useState<Question[]>([]);
  const [quizzes, setQuizzes] = useState<Question[]>([]);

  useEffect(() => {
    (async () => {
      const { data: s } = await supabase.from("subtopics").select("*").eq("id", sid).maybeSingle();
      setSub(s as Subtopic | null);
      if (s) {
        const { data: st } = await supabase.from("stages").select("*").eq("id", (s as any).stage_id).maybeSingle();
        setStage(st as Stage | null);
      }
      const [{ data: c }, { data: f }, { data: q }] = await Promise.all([
        supabase.from("cheatsheets").select("*").eq("subtopic_id", sid).order("sort_order"),
        supabase.from("flashcards").select("*").eq("subtopic_id", sid),
        supabase.from("questions").select("*").eq("subtopic_id", sid),
      ]);
      setCheats((c as Cheatsheet[]) ?? []);
      setCards((f as Flashcard[]) ?? []);
      const qs = (q as any[]) ?? [];
      setFills(qs.filter(x => x.type === "fill_blank"));
      setQuizzes(qs.filter(x => x.type === "quiz"));
    })();
  }, [sid]);

  async function saveProgress(qid: number, isCorrect: boolean, answer: string) {
    if (!user) return;
    const { error } = await supabase.functions.invoke("progress", {
      body: { action: "insert", user_id: user.id, question_id: qid, is_correct: isCorrect, user_answer: answer },
    });
    if (error) toast.error("기록 저장 실패: " + error.message);
  }

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto max-w-4xl px-4 py-6">
        <div className="flex items-center justify-between gap-3">
          <nav className="text-sm text-slate-600">
            <Link to="/dashboard" className="text-indigo-600 hover:underline">대시보드</Link>
            {stage && (<> <span className="mx-1.5 text-slate-400">›</span><span>{stage.sort_order}단계 {stage.name}</span></>)}
            {sub && (<> <span className="mx-1.5 text-slate-400">›</span><span className="font-medium text-slate-900">{sub.name}</span></>)}
          </nav>
          <Link to="/dashboard" className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">← 뒤로</Link>
        </div>

        <div className="mt-5 flex flex-wrap gap-1 border-b border-slate-200">
          {TABS.map(t => (
            <button key={t.k} onClick={() => setTab(t.k)}
              className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition ${tab === t.k ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "cheatsheet" && <CheatsheetView items={cheats} />}
          {tab === "flashcard" && <FlashcardView cards={cards} />}
          {tab === "fill" && <FillView questions={fills} onSave={saveProgress} />}
          {tab === "quiz" && <QuizView questions={quizzes} onSave={saveProgress} />}
        </div>
      </main>
    </div>
  );
}

function CheatsheetView({ items }: { items: Cheatsheet[] }) {
  if (!items.length) return <Empty msg="치트시트가 아직 없습니다." />;
  return (
    <div className="space-y-5">
      {items.map(c => (
        <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">{c.title}</h3>
          <div className="mt-2"><Markdown source={c.content_markdown} /></div>
        </div>
      ))}
    </div>
  );
}

function FlashcardView({ cards }: { cards: Flashcard[] }) {
  const [idx, setIdx] = useState(0);
  const [flip, setFlip] = useState(false);
  useEffect(() => { setFlip(false); }, [idx]);
  if (!cards.length) return <Empty msg="플래시카드가 아직 없습니다." />;
  const card = cards[idx];
  return (
    <div className="mx-auto max-w-2xl">
      <p className="mb-3 text-center text-xs text-slate-500">{idx + 1} / {cards.length}</p>
      <button onClick={() => setFlip(f => !f)}
        className="relative w-full rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm hover:border-indigo-300">
        <p className="text-[11px] uppercase tracking-wider text-slate-400">{flip ? "뒷면" : "앞면"} · 클릭하여 뒤집기</p>
        <div className="mt-3 min-h-[120px] text-lg font-medium text-slate-900">
          {flip ? <Markdown source={card.back_text} /> : <span>{card.front_text}</span>}
        </div>
      </button>
      <div className="mt-4 flex justify-between">
        <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}
          className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-40">← 이전</button>
        <button onClick={() => setIdx(i => Math.min(cards.length - 1, i + 1))} disabled={idx === cards.length - 1}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40">다음 →</button>
      </div>
    </div>
  );
}

function FillView({ questions, onSave }: { questions: Question[]; onSave: (qid: number, ok: boolean, a: string) => void }) {
  const [idx, setIdx] = useState(0);
  const [val, setVal] = useState("");
  const [result, setResult] = useState<null | { ok: boolean }>(null);
  useEffect(() => { setVal(""); setResult(null); }, [idx, questions.length]);
  if (!questions.length) return <Empty msg="빈칸채우기 문제가 아직 없습니다." />;
  const q = questions[idx];

  function check() {
    const ok = val.trim().toLowerCase() === q.correct_answer.trim().toLowerCase();
    setResult({ ok });
    onSave(q.id, ok, val);
  }
  function next() { setIdx(i => (i + 1) % questions.length); }

  return (
    <div className="mx-auto max-w-2xl">
      <p className="mb-3 text-xs text-slate-500">{idx + 1} / {questions.length}</p>
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-base text-slate-900"><Markdown source={q.question_text} /></p>
        <div className="mt-4 flex gap-2">
          <input value={val} onChange={e => setVal(e.target.value)} disabled={!!result}
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          {!result ? (
            <button onClick={check} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">채점</button>
          ) : (
            <button onClick={next} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">다음 문제</button>
          )}
        </div>
        {result && <Verdict ok={result.ok} answer={q.correct_answer} explanation={q.explanation} />}
      </div>
    </div>
  );
}

function QuizView({ questions, onSave }: { questions: Question[]; onSave: (qid: number, ok: boolean, a: string) => void }) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  useEffect(() => { setPicked(null); }, [idx, questions.length]);
  if (!questions.length) return <Empty msg="퀴즈 문제가 아직 없습니다." />;
  const q = questions[idx];
  const opts = q.options ?? [];
  const result = picked == null ? null : { ok: picked === q.correct_answer };

  function pick(opt: string) {
    if (picked != null) return;
    setPicked(opt);
    onSave(q.id, opt === q.correct_answer, opt);
  }
  function next() { setIdx(i => (i + 1) % questions.length); }

  return (
    <div className="mx-auto max-w-2xl">
      <p className="mb-3 text-xs text-slate-500">{idx + 1} / {questions.length}</p>
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-base text-slate-900"><Markdown source={q.question_text} /></p>
        <div className="mt-4 space-y-2">
          {opts.map(o => {
            const isPicked = picked === o;
            const isAns = o === q.correct_answer;
            let cls = "border-slate-200 bg-white hover:bg-slate-50";
            if (picked != null) {
              if (isAns) cls = "border-green-500 bg-green-50";
              else if (isPicked) cls = "border-red-400 bg-red-50";
              else cls = "border-slate-200 bg-white opacity-70";
            }
            return (
              <button key={o} onClick={() => pick(o)} disabled={picked != null}
                className={`w-full rounded-md border px-4 py-2.5 text-left text-sm text-slate-800 transition ${cls}`}>
                {o}
              </button>
            );
          })}
        </div>
        {result && (
          <>
            <Verdict ok={result.ok} answer={q.correct_answer} explanation={q.explanation} />
            <div className="mt-3 text-right">
              <button onClick={next} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">다음 문제</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Verdict({ ok, answer, explanation }: { ok: boolean; answer: string; explanation: string | null }) {
  return (
    <div className={`mt-4 rounded-md border p-3 text-sm ${ok ? "border-green-200 bg-green-50 text-green-900" : "border-red-200 bg-red-50 text-red-900"}`}>
      <p className="font-semibold">{ok ? "정답입니다! 🎉" : "오답입니다."}</p>
      <p className="mt-1"><span className="font-medium">정답:</span> {answer}</p>
      {explanation && <p className="mt-1"><span className="font-medium">해설:</span> {explanation}</p>}
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">{msg}</div>;
}
