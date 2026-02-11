import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ minHeight: '100vh', backgroundColor: '#0c0e14' }}>
        {/* Navbar */}
        <nav style={{
          borderBottom: '1px solid #1e2130',
          backgroundColor: '#0c0e14',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Link href="/properties" style={{
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '7px',
                fontSize: '15px',
                fontWeight: 500,
                color: '#8b90a0',
                border: '1px solid #1e2130',
                backgroundColor: 'transparent',
                transition: 'all 0.15s',
              }}>
                Properties
              </Link>
            </div>
          </div>
        </nav>

        <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
          {children}
        </main>
      </body>
    </html>
  )
}