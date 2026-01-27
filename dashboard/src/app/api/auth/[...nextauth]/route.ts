import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                // Pour la simplicité du POC:
                // Si l'utilisateur n'existe pas, on le crée à la volée s'il s'appelle "admin"
                if (credentials.email === "admin@monitor.com" && credentials.password === "admin") {
                    return { id: "1", name: "Admin", email: "admin@monitor.com" }
                }

                return null
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: "jwt",
    },
})

export { handler as GET, handler as POST }
