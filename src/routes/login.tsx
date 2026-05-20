import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (session) {
    setTimeout(() => navigate({ to: "/admin" }), 0);
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/admin" } });
        if (error) throw error;
        // Try to bootstrap admin (only works if no admin exists yet)
        await supabase.rpc("bootstrap_admin");
        toast.success("Conta criada! Redirecionando…");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vinda!");
      }
      navigate({ to: "/admin" });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-gradient-to-br from-[var(--wine-deep)] to-[var(--wine)]">
      <div className="w-full max-w-md rounded-2xl bg-card p-8 shadow-[var(--shadow-luxury)]">
        <img src={logo} alt="" className="h-20 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-center">{mode === "signin" ? "Acesso administrativo" : "Criar conta"}</h1>
        <p className="text-center text-sm text-muted-foreground mt-1">Painel restrito da imobiliária</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input type="email" required placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm" />
          <input type="password" required minLength={6} placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm" />
          <button disabled={loading} className="w-full rounded-lg bg-[var(--wine)] py-3 text-sm font-bold text-white hover:bg-[var(--wine-deep)] disabled:opacity-60">
            {loading ? "Aguarde…" : mode === "signin" ? "Entrar" : "Criar conta"}
          </button>
        </form>
        <button onClick={() => setMode(m => m === "signin" ? "signup" : "signin")} className="mt-4 w-full text-sm text-muted-foreground hover:text-[var(--wine)]">
          {mode === "signin" ? "Primeiro acesso? Criar conta" : "Já tenho conta — entrar"}
        </button>
      </div>
    </div>
  );
}
