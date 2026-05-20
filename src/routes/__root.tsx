import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, useRouter, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-md">
          <h1 className="text-7xl font-bold text-[var(--wine)]">404</h1>
          <h2 className="mt-4 text-xl font-semibold">Página não encontrada</h2>
          <p className="mt-2 text-sm text-muted-foreground">O conteúdo que você procura não está disponível.</p>
          <a href="/" className="mt-6 inline-flex rounded-md bg-[var(--wine)] px-5 py-3 text-sm font-semibold text-white hover:opacity-90">Voltar ao início</a>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  console.error(error);
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-xl font-semibold">Algo deu errado</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-6 rounded-md bg-[var(--wine)] px-5 py-3 text-sm font-semibold text-white">Tentar novamente</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Mel & Samara Corretores Associados — Imóveis em Teresina/PI" },
      { name: "description", content: "Catálogo de imóveis para venda, locação e administração em Teresina/PI. CRECI 3730/PF e 4331/PF." },
      { property: "og:title", content: "Mel & Samara Corretores Associados — Imóveis em Teresina/PI" },
      { property: "og:description", content: "Catálogo de imóveis para venda, locação e administração em Teresina/PI. CRECI 3730/PF e 4331/PF." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Mel & Samara Corretores Associados — Imóveis em Teresina/PI" },
      { name: "twitter:description", content: "Catálogo de imóveis para venda, locação e administração em Teresina/PI. CRECI 3730/PF e 4331/PF." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/edb8faca-1730-411d-a21e-7de1ce9dc5c7/id-preview-10e892ba--bf723104-b519-4815-87e8-1d505e4c83a8.lovable.app-1779283413348.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/edb8faca-1730-411d-a21e-7de1ce9dc5c7/id-preview-10e892ba--bf723104-b519-4815-87e8-1d505e4c83a8.lovable.app-1779283413348.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700;900&family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1"><Outlet /></main>
        <Footer />
      </div>
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
