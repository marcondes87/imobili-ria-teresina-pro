import { Link } from "@tanstack/react-router";
import { Phone, MapPin, Mail } from "lucide-react";
import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="bg-[var(--wine-deep)] text-white/85 mt-24">
      <div className="container mx-auto px-4 py-16 grid gap-10 md:grid-cols-3">
        <div>
          <img src={logo} alt="Mel & Samara" className="h-20 w-auto mb-4" />
          <p className="text-sm text-white/70 max-w-xs">
            Corretores Associados — Seu imóvel em boas mãos.
          </p>
          <p className="text-xs text-white/50 mt-3">CRECI: 3730/PF · CNAI 51371 · CRECI: 4331/PF</p>
        </div>
        <div>
          <h3 className="text-[var(--gold)] font-semibold mb-4">Navegação</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/venda" className="hover:text-[var(--gold)]">Imóveis à venda</Link></li>
            <li><Link to="/locacao" className="hover:text-[var(--gold)]">Para alugar</Link></li>
            <li><Link to="/administracao" className="hover:text-[var(--gold)]">Administração</Link></li>
            <li><Link to="/contato" className="hover:text-[var(--gold)]">Contato</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-[var(--gold)] font-semibold mb-4">Contato</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3"><MapPin className="shrink-0 text-[var(--gold)]" size={18} /> Rua Gen. Ademar Richa, 1453 — Sala A, Bairro de Fátima, Teresina/PI</li>
            <li className="flex gap-3"><Phone className="shrink-0 text-[var(--gold)]" size={18} /> (86) 99944-8289</li>
            <li className="flex gap-3"><Mail className="shrink-0 text-[var(--gold)]" size={18} /> contato@melesamara.com.br</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Mel & Samara Corretores Associados. Todos os direitos reservados.
      </div>
    </footer>
  );
}
