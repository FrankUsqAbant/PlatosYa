// ==========================================================================
// PlatoYa - Layout raíz de la aplicación
// Configura fuentes, metadatos y envuelve con Providers + Navbar
// ==========================================================================

import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'PlatoYa | Tu Restaurante Favorito',
  description:
    'Ordena los mejores platos de restaurante directamente a tu puerta. Menú variado, pago seguro y seguimiento en tiempo real.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Google Fonts imported in globals.css */}
      </head>
      <body>
        <Providers>
          <Navbar />
          <main style={{ position: 'relative', zIndex: 1 }}>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
