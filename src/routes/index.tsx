import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { useAuth } from "@/components/AuthContext";
import { useEffect } from "react";

export const Route = createFileRoute("/")({ component: Landing });

function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate({ to: user.is_admin ? "/admin" : "/dashboard" });
  }, [user, navigate]);

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto max-w-5xl px-4 py-16 md:py-24">
        <section className="text-center">
          <p className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
            AICE Associate · KT · 한국경제신문 공동주관 대비
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            공무원·일반인을 위한<br className="hidden md:block" /> AICE Associate 학습 도구
          </h1>
          <p className="mt-4 text-base text-slate-600 md:text-lg">
            데이터분석 → 전처리 → 모델링 3단계 워크플로우로 차근차근 학습하세요.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/auth"
              className="inline-flex items-center rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
              시작하기
            </Link>
            <Link to="/auth"
              className="inline-flex items-center rounded-md border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              로그인
            </Link>
          </div>
        </section>

        <section className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            { n: "1", t: "데이터분석", d: "라이브러리·파일로드·시각화 등 기초 다지기" },
            { n: "2", t: "전처리", d: "이상치·결측치·인코딩·스케일링 핵심 정리" },
            { n: "3", t: "모델링", d: "ML/딥러닝 학습부터 성능평가까지" },
          ].map((s) => (
            <div key={s.n} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-50 text-sm font-semibold text-indigo-700">{s.n}</div>
              <h3 className="mt-3 text-base font-semibold text-slate-900">{s.t}</h3>
              <p className="mt-1 text-sm text-slate-600">{s.d}</p>
            </div>
          ))}
        </section>

        <section className="mt-12 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          <p className="font-semibold">보안 안내</p>
          <p className="mt-1 leading-6">
            별칭 + 4자리 비밀번호만으로 가입합니다. 개인정보를 수집하지 않습니다.
            별칭은 가명, 비밀번호는 다른 곳에서 쓰지 않는 4자리를 권장합니다.
          </p>
        </section>
      </main>
    </div>
  );
}
