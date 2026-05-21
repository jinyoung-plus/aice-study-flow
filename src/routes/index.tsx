import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { useAuth } from "@/components/AuthContext";
import { useEffect } from "react";

export const Route = createFileRoute("/")({ component: Landing });

const STAGES = [
  {
    n: "1",
    t: "데이터분석",
    d: "라이브러리·파일로드·시각화 등 기초 다지기",
    accent: "bg-blue-500",
    chip: "bg-blue-50 text-blue-700",
    grad: "from-blue-500/10 to-transparent",
    ring: "hover:ring-blue-200",
  },
  {
    n: "2",
    t: "전처리",
    d: "이상치·결측치·인코딩·스케일링 핵심 정리",
    accent: "bg-emerald-500",
    chip: "bg-emerald-50 text-emerald-700",
    grad: "from-emerald-500/10 to-transparent",
    ring: "hover:ring-emerald-200",
  },
  {
    n: "3",
    t: "모델링",
    d: "ML·딥러닝 학습부터 성능평가까지",
    accent: "bg-violet-500",
    chip: "bg-violet-50 text-violet-700",
    grad: "from-violet-500/10 to-transparent",
    ring: "hover:ring-violet-200",
  },
];

function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate({ to: user.is_admin ? "/admin" : "/dashboard" });
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <TopBar />
      <main className="mx-auto max-w-5xl px-4 py-16 md:py-24">
        <section className="text-center">
          <p className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
            AICE Associate · KT · 한국경제신문 공동주관 대비
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 md:text-6xl md:tracking-[-0.02em]">
            모두를 위한
            <br className="hidden md:block" />{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              AICE Associate
            </span>{" "}
            학습 도구
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-slate-600 md:text-lg">
            데이터분석 → 전처리 → 모델링, 3단계 워크플로우로 차근차근 학습하세요.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              to="/auth"
              className="inline-flex items-center rounded-md bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:shadow-md hover:brightness-110"
            >
              시작하기
            </Link>
            <Link
              to="/auth"
              className="inline-flex items-center rounded-md border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              로그인
            </Link>
          </div>
        </section>

        <section className="mt-20 grid gap-5 md:grid-cols-3">
          {STAGES.map((s) => (
            <div
              key={s.n}
              className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-transparent transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${s.ring}`}
            >
              <div className={`absolute inset-x-0 top-0 h-1 ${s.accent}`} />
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${s.grad} opacity-0 transition-opacity duration-200 group-hover:opacity-100`}
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold ${s.chip}`}
                  >
                    {s.n}
                  </div>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                    Stage {s.n}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{s.t}</h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-600">{s.d}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-xl border border-slate-200 bg-white/60 px-6 py-4 text-sm text-slate-600 shadow-sm backdrop-blur">
          <span>📚 3단계 워크플로우</span>
          <span className="text-slate-300">·</span>
          <span>📝 15개 학습 모듈</span>
          <span className="text-slate-300">·</span>
          <span>🎯 손코딩 100점 목표</span>
        </section>

        <section className="mt-10 rounded-xl border-l-4 border-slate-300 bg-slate-50/80 p-5 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">보안 안내</p>
          <p className="mt-1 leading-6">
            별칭 + 4자리 비밀번호만으로 가입합니다. 개인정보를 수집하지 않습니다.
            별칭은 가명, 비밀번호는 다른 곳에서 쓰지 않는 4자리를 권장합니다.
          </p>
        </section>
      </main>
    </div>
  );
}
