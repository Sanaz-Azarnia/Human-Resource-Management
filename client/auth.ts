import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { cookies } from "next/headers";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                personnelId: { label: "PersonnelId", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.personnelId || !credentials?.password) {
                    return null;
                }

                try {
                    const res = await fetch(`${process.env.BACKEND_URL}/api/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            personnelId: credentials.personnelId,
                            password: credentials.password,
                        }),
                    });

                    if (!res.ok) return null;

                    const user = await res.json();

                    
                    const cookieStore = await cookies();
                    cookieStore.set('token', user.token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax',
                        maxAge: 60 * 60 * 24 * 7,
                        path: '/',
                    });

                    return {
                        id: user.userId.toString(),
                        userId: user.userId,
                        token: user.token,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        roleId: user.roleId,
                        avatarUrl: user.avatarUrl,
                    };
                } catch {
                    return null;
                }
            },
        }),
    ],
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.backendToken = user.token;
                token.userId = user.userId;
                token.roleId = user.roleId;
                token.firstname = user.firstname;
                token.lastname = user.lastname;
                token.avatarUrl = user.avatarUrl;
            }
            return token;
        },
        async session({ session, token }) {
            const customSession = session as any;
            customSession.backendToken = token.backendToken;
            customSession.user.id = token.userId?.toString();
            customSession.user.firstname = token.firstname;
            customSession.user.lastname = token.lastname;
            customSession.user.roleId = token.roleId;
            customSession.user.avatarUrl = token.avatarUrl;
            return session;
        },
    },
    events: {
        async signOut() {
            const cookieStore = await cookies();
            cookieStore.delete('token');
        },
    },
});