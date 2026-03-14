import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-text-pretty">
            Bem-vindo à Plataforma SaaS
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Uma solução completa, moderna e escalável para gerenciar seu negócio.
            Autenticação segura, dashboard intuitivo e pronto para monetização.
          </p>
          <div className="flex gap-4 justify-center pt-8">
            <Link
              href="/auth/signup"
              className="px-8 py-3 rounded-lg bg-secondary text-secondary-foreground font-semibold hover:opacity-90 transition"
            >
              Começar Gratuitamente
            </Link>
            <Link
              href="/auth/signin"
              className="px-8 py-3 rounded-lg border border-border text-foreground font-semibold hover:bg-muted transition"
            >
              Fazer Login
            </Link>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {[
            {
              title: "Autenticação Segura",
              description: "JWT seguro com Supabase Auth",
            },
            {
              title: "Dashboard Moderno",
              description: "Interface intuitiva e responsiva",
            },
            {
              title: "Escalável",
              description: "Pronto para crescer com seu negócio",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-lg border border-border bg-background hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
