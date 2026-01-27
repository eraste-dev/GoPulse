"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, Zap, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("admin@monitor.com")
  const [password, setPassword] = useState("admin")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (res?.error) {
        setError("Identifiants ou accès refusés.")
        setIsLoading(false)
        return
      }

      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      setError("Une erreur technique est survenue.")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-[120px] -z-10 animate-delay-1000" />

      <div className="mb-8 flex items-center gap-3">
        <div className="p-2 rounded-2xl bg-primary shadow-xl shadow-primary/30">
          <Zap className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tighter text-foreground">
          GoPulse
        </h1>
      </div>

      <Card className="w-full max-w-[400px] border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl rounded-3xl">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold">Heureux de vous revoir</CardTitle>
          <CardDescription>Entrez vos identifiants pour accéder à la supervision.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email professionnel</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="nom@entreprise.com" 
                className="rounded-xl h-12 bg-background/50 border-border/50 focus:border-primary transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <Link href="#" className="text-xs text-primary hover:underline">Oublié ?</Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                className="rounded-xl h-12 bg-background/50 border-border/50 focus:border-primary transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm border border-destructive/20 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <Button 
                type="submit" 
                className="w-full h-12 rounded-xl bg-primary hover:bg-accent text-primary-foreground font-bold text-base transition-all shadow-lg shadow-primary/10"
                disabled={isLoading}
            >
              {isLoading ? "Authentification..." : "Se connecter"}
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/50"></span></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Accès sécurisé</span></div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/50 py-3 rounded-2xl border border-border/50">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Protection 2FA activée sur ce compte
            </div>
          </form>
        </CardContent>
      </Card>
      
      <p className="mt-8 text-sm text-muted-foreground">
        Pas encore de compte ? <Link href="#" className="text-primary font-semibold hover:underline">Contactez l'administrateur</Link>
      </p>
    </div>
  )
}

import Link from "next/link"
