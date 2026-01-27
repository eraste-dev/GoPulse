"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Globe, 
  Settings, 
  LogOut, 
  Bell, 
  User,
  Menu,
  X,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

interface SidebarProps {
  className?: string
}

export function Shell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false)
  const pathname = usePathname()

  const navItems = [
    { name: "Tableau de Bord", href: "/dashboard", icon: LayoutDashboard },
    { name: "Mes Moniteurs", href: "/dashboard/monitors", icon: Globe },
    { name: "Alertes", href: "/dashboard/alerts", icon: Bell },
    { name: "Mon Compte", href: "/dashboard/account", icon: User },
    { name: "Paramètres", href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-secondary border-r border-border transition-transform transform lg:relative lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-border/50 bg-background/5">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="p-1.5 rounded-lg bg-primary group-hover:bg-accent transition-colors">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground transition-all">
                GoPulse
              </span>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden" 
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-background/20 hover:text-foreground"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-transform group-hover:scale-110",
                  pathname === item.href ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
                )} />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Footer / Account */}
          <div className="p-4 border-t border-border/50">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 rounded-xl hover:bg-destructive/10 hover:text-destructive group text-muted-foreground"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="w-5 h-5 group-hover:translate-x-1" />
              Déconnexion
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-background/80 backdrop-blur-md border-b border-border z-30">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden" 
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </Button>
            <div className="hidden sm:block">
              <h2 className="text-sm font-medium text-muted-foreground">
                Bienvenue, <span className="text-foreground">Utilisateur</span>
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             {/* Dynamic Theme Toggle could go here */}
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent" />
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--muted-foreground);
        }
      `}</style>
    </div>
  )
}
