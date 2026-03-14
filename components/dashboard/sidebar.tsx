'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { useSubscription } from '@/lib/hooks/useSubscription'
import { createClient } from '@/lib/supabase/client'

export function DashboardSidebar() {
  const router = useRouter()
  const { user } = useAuth()
  const { plan } = useSubscription()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Miguel Tech</h1>
        <p className="text-sm text-muted-foreground">SaaS Platform</p>
      </div>

      <nav className="flex-1 space-y-2">
        <Link
          href="/dashboard"
          className="block px-4 py-2 rounded-md hover:bg-accent text-foreground transition"
        >
          Dashboard
        </Link>
        <Link
          href="/dashboard/organizations"
          className="block px-4 py-2 rounded-md hover:bg-accent text-foreground transition"
        >
          Organizações
        </Link>
        <Link
          href="/pricing"
          className="block px-4 py-2 rounded-md hover:bg-accent text-foreground transition"
        >
          Planos
        </Link>
        <Link
          href="/dashboard/settings"
          className="block px-4 py-2 rounded-md hover:bg-accent text-foreground transition"
        >
          Configurações
        </Link>
      </nav>

      <div className="border-t border-border pt-4 space-y-4">
        <div className="px-4">
          <p className="text-sm font-medium text-foreground">{user?.email}</p>
          <p className="text-xs text-muted-foreground">
            Plano: <span className="font-semibold capitalize">{plan}</span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 transition"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}
