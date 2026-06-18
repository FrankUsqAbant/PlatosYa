// ==========================================================================
// PlatoYa - Configuración de autenticación con Auth.js v5
// Usa Credentials provider para autenticar contra el backend Express
// ==========================================================================

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      // Función de autorización: llama al backend para validar credenciales
      async authorize(credentials) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          // Si la respuesta es exitosa y contiene token, retorna el usuario
          if (res.ok && data.token) {
            return {
              id: data.user.id,
              name: data.user.nombre,
              email: data.user.email,
              role: data.user.role,
              accessToken: data.token,
            };
          }

          console.error("Auth Failed - Response not OK or missing token:", res.status, data);
          return null;
        } catch (error) {
          console.error("Auth Exception - Fetch failed:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // Callback JWT: almacena datos extra en el token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    // Callback de sesión: expone datos del token en la sesión del cliente
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
  },
  trustHost: true,
});
