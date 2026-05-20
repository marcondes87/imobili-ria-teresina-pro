import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/use-auth";

const nav = [
  { to: "/", label: "Início" },
  { to: "/venda", label: "Venda" },
  { to: "/locacao", label: "Locação" },
  { to: "/administracao", label: "Administração" },
  { to: "/contato", label: "Contato" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { isAdmin } = useAuth();
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-[var(--wine-deep)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--wine-deep)]/80">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Mel & Samara Corretores" className="h-14 w-auto" />
        </Link>
        <nav className="hidden lg:flex items-center gap-1">
          {nav.map(n => (
            <Link
              key={n.to}
              to={n.to as any}
              className="px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:text-[var(--gold)]"
              activeProps={{ className: "px-4 py-2 text-sm font-semibold text-[var(--gold)]" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" className="ml-2 rounded-md bg-[var(--gold)] px-4 py-2 text-sm font-semibold text-[var(--gold-foreground)] hover:opacity-90">
              Painel
            </Link>
          )}
        </nav>
        <button onClick={() => setOpen(v => !v)} className="lg:hidden text-white p-2" aria-label="Menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-white/10 bg-[var(--wine-deep)]">
          <div className="container mx-auto flex flex-col px-4 py-2">
            {nav.map(n => (
              <Link key={n.to} to={n.to as any} onClick={() => setOpen(false)} className="py-3 text-white/90">
                {n.label}
              </Link>
            ))}
            {isAdmin && <Link to="/admin" onClick={() => setOpen(false)} className="py-3 text-[var(--gold)] font-semibold">Painel Admin</Link>}
          </div>
        </div>
      )}
    </header>
  );
}
