import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Globe, 
  Clock, 
  Settings2, 
  MoreVertical,
  Wifi,
  WifiOff
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export const dynamic = 'force-dynamic'

export default async function MonitorsPage() {
  const monitors = await prisma.monitor.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      reports: {
        orderBy: { timestamp: 'desc' },
        take: 1
      }
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes Moniteurs</h1>
          <p className="text-muted-foreground">
            Gérez vos sites web et services surveillés en temps réel.
          </p>
        </div>
        <Button asChild className="rounded-xl gap-2 shadow-lg shadow-primary/20 bg-primary hover:bg-accent text-primary-foreground font-semibold h-11 px-6">
          <Link href="/dashboard/monitors/new">
            <Plus className="w-5 h-5" />
            Nouveau Moniteur
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {monitors.map((monitor) => {
          const lastReport = monitor.reports[0]
          const isUp = lastReport?.status === 'UP'

          return (
            <Card key={monitor.id} className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5 bg-card/50 backdrop-blur-sm rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2.5 rounded-xl transition-colors",
                    isUp ? "bg-blue-500/10 text-blue-500" : "bg-red-500/10 text-red-500"
                  )}>
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                      {monitor.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                      {monitor.url}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isUp ? (
                      <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20 rounded-lg gap-1 px-2 py-0.5">
                        <Wifi className="w-3 h-3" /> En ligne
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="rounded-lg gap-1 px-2 py-0.5">
                        <WifiOff className="w-3 h-3" /> Hors ligne
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    Toutes les {monitor.interval}s
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-3 px-4 rounded-xl bg-background/50 border border-border/30">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Latence</p>
                    <p className="text-sm font-bold text-foreground">{lastReport?.responseTime ? `${lastReport.responseTime.toFixed(0)} ms` : '-'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Régions</p>
                    <div className="flex gap-1">
                        {monitor.regions.map(r => (
                            <div key={r} className="w-2 h-2 rounded-full bg-primary" title={r} />
                        ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" className="flex-1 rounded-xl text-xs h-9 bg-secondary hover:bg-secondary/80">
                    Historique
                  </Button>
                  <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-border hover:bg-primary/10 hover:border-primary/50 text-muted-foreground hover:text-primary">
                    <Settings2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {/* Add Monitor Placeholder Card */}
        <Link href="/dashboard/monitors/new" className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all group grayscale hover:grayscale-0">
          <div className="p-4 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
            <Plus className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
          </div>
          <p className="mt-4 font-semibold text-muted-foreground group-hover:text-primary">
            Ajouter un moniteur
          </p>
          <p className="text-xs text-muted-foreground/60 text-center mt-2">
            Surveillez un nouveau site web ou une API
          </p>
        </Link>
      </div>
    </div>
  )
}


