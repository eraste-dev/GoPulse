"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  ArrowLeft, 
  Save, 
  Globe, 
  Settings2,
  Clock,
  ShieldAlert
} from "lucide-react"
import Link from "next/link"

export default function NewMonitorPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    url: "https://",
    method: "GET",
    interval: 60,
    threshold: 3,
    regions: ["europe"]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // API Call would go here
    setTimeout(() => {
        setIsLoading(false)
        router.push("/dashboard/monitors")
    }, 1000)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-xl">
          <Link href="/dashboard/monitors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nouveau Moniteur</h1>
          <p className="text-muted-foreground">Configurez la surveillance de votre service.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <div className="flex items-center gap-2 text-primary">
              <Globe className="w-5 h-5" />
              <CardTitle className="text-lg">Configuration de base</CardTitle>
            </div>
            <CardDescription>Informations essentielles pour identifier le site.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du moniteur</Label>
                <Input 
                  id="name" 
                  placeholder="Ex: Mon Site Vitrine" 
                  className="rounded-xl"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL à surveiller</Label>
                <Input 
                  id="url" 
                  type="url" 
                  placeholder="https://mon-site.com" 
                  className="rounded-xl"
                  value={formData.url}
                  onChange={e => setFormData({...formData, url: e.target.value})}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-accent/5 border-b border-accent/10">
            <div className="flex items-center gap-2 text-accent-foreground">
              <Settings2 className="w-5 h-5" />
              <CardTitle className="text-lg">Paramètres avancés</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                    <Clock className="w-4 h-4 text-primary" />
                    Intervalle de vérification
                </div>
                <div className="flex items-center gap-4">
                    <input 
                        type="range" 
                        min="30" 
                        max="300" 
                        step="30"
                        className="flex-1 accent-primary"
                        value={formData.interval}
                        onChange={e => setFormData({...formData, interval: parseInt(e.target.value)})}
                    />
                    <span className="font-bold text-primary w-12">{formData.interval}s</span>
                </div>
                <p className="text-[10px] text-muted-foreground">Fréquence à laquelle l'agent testera votre URL.</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                    <ShieldAlert className="w-4 h-4 text-primary" />
                    Seuil d'alerte (Retries)
                </div>
                <div className="flex gap-2">
                    {[1, 2, 3, 5].map(v => (
                        <Button 
                            key={v}
                            type="button"
                            variant={formData.threshold === v ? "default" : "outline"}
                            className="flex-1 rounded-xl h-10"
                            onClick={() => setFormData({...formData, threshold: v})}
                        >
                            {v}
                        </Button>
                    ))}
                </div>
                <p className="text-[10px] text-muted-foreground">Nombre d'échecs consécutifs avant notification.</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
                <Label>Régions de test</Label>
                <div className="flex flex-wrap gap-2">
                    {['Europe', 'USA East', 'USA West', 'Asia'].map(r => (
                        <Button 
                            key={r}
                            type="button"
                            variant={formData.regions.includes(r.toLowerCase()) ? "secondary" : "outline"}
                            className="rounded-full px-4 h-8 text-xs gap-1"
                            onClick={() => {
                                const reg = r.toLowerCase()
                                const newRegs = formData.regions.includes(reg)
                                    ? formData.regions.filter(x => x !== reg)
                                    : [...formData.regions, reg]
                                setFormData({...formData, regions: newRegs})
                            }}
                        >
                            {r}
                        </Button>
                    ))}
                </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" asChild className="rounded-xl h-12 px-8">
                <Link href="/dashboard/monitors">Annuler</Link>
            </Button>
            <Button 
                type="submit" 
                className="rounded-xl h-12 px-10 bg-primary hover:bg-accent text-primary-foreground font-bold shadow-lg shadow-primary/20"
                disabled={isLoading}
            >
                {isLoading ? "Création..." : "Enregistrer le Moniteur"}
                {!isLoading && <Save className="w-5 h-5 ml-2" />}
            </Button>
        </div>
      </form>
    </div>
  )
}
