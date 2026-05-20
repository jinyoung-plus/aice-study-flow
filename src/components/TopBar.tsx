import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "./AuthContext";

export function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to={user ? (user.is_admin ? "/admin" : "/dashboard") : "/"} className="flex items-center gap-2 text-slate-900">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-indigo-600" />
          <span className="font-semibold tracking-tight">AICE Study</span>
        </Link>
        {user ? (
          <nav className="flex items-center gap-1 text-sm">
            {!user.is_admin && (
              <>
                <Link to="/dashboard" className="rounded px-3 py-1.5 text-slate-700 hover:bg-slate-100">대시보드</Link>
                <Link to="/me" className="rounded px-3 py-1.5 text-slate-700 hover:bg-slate-100">마이페이지</Link>
              </>
            )}
            {user.is_admin && (
              <Link to="/admin" className="rounded px-3 py-1.5 text-slate-700 hover:bg-slate-100">관리자</Link>
            )}
            <span className="ml-2 hidden text-slate-500 sm:inline">{user.nickname} 님</span>
            <button
              onClick={() => { logout(); navigate({ to: "/" }); }}
              className="ml-2 rounded border border-slate-200 px-3 py-1.5 text-slate-700 hover:bg-slate-50"
            >
              로그아웃
            </button>
          </nav>
        ) : (
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/auth" className="rounded px-3 py-1.5 text-slate-700 hover:bg-slate-100">로그인</Link>
          </nav>
        )}
      </div>
    </header>
  );
}
