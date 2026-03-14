import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Miguel Tech</h1>
          <nav className="space-x-4">
            <Link href="/auth/login" className="text-foreground hover:text-primary transition">
              Login
            </Link>
            <Link href="/auth/register" className="text-foreground hover:text-primary transition">
              Registrar
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center space-y-8">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground">
            Plataforma SaaS Escalável
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Uma solução completa, moderna e pronta para produção. Autenticação segura, 
            dashboard intuitivo, multi-tenant e estrutura preparada para monetização.
          </p>
          <div className="flex gap-4 justify-center pt-8">
            <Link href="/auth/register">
              <Button size="lg">
                Começar Gratuitamente
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline">
                Fazer Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          {[
            {
              title: "Autenticação Segura",
              description: "JWT seguro com Supabase Auth integrado",
              icon: "🔐",
            },
            {
              title: "Multi-Tenant",
              description: "Suporte completo para múltiplas organizações",
              icon: "🏢",
            },
            {
              title: "Dashboard Moderno",
              description: "Interface intuitiva e totalmente responsiva",
              icon: "📊",
            },
            {
              title: "Escalável",
              description: "Arquitetura pronta para crescimento",
              icon: "📈",
            },
            {
              title: "Pronto para Payments",
              description: "Integração com Stripe preparada",
              icon: "💳",
            },
            {
              title: "TypeScript Full-Stack",
              description: "Type-safe em todo o projeto",
              icon: "✨",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-8 rounded-lg border border-border bg-card hover:shadow-lg hover:border-primary/50 transition"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="mt-24 p-12 rounded-lg border border-border bg-card text-center">
          <h3 className="text-2xl font-bold text-foreground mb-6">Stack Tecnológico</h3>
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              "Next.js 15",
              "TypeScript",
              "Supabase",
              "PostgreSQL",
              "Tailwind CSS",
              "shadcn/ui",
              "React Server Components",
            ].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center space-y-6">
          <h3 className="text-3xl font-bold text-foreground">
            Pronto para começar?
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Crie sua conta agora e explore todas as funcionalidades da plataforma.
            Sem necessidade de cartão de crédito para começar.
          </p>
          <Link href="/auth/register">
            <Button size="lg">
              Criar Conta Gratuitamente
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-24 py-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Miguel Tech Solutions. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  );
}
