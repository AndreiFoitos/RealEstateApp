import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Realty — Energy Dashboard',
  description: 'Manage properties and view energy consumption data',
}

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
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
            <Link href="/properties" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '26px', height: '26px',
                backgroundColor: '#d4a843',
                borderRadius: '5px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0c0e14" strokeWidth="2.5">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '17px', color: '#e2e4ec', letterSpacing: '-0.01em' }}>
                Realty
              </span>
            </Link>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Link href="/properties" style={{
                textDecoration: 'none',
                padding: '6px 14px',
                borderRadius: '7px',
                fontSize: '13px',
                fontWeight: 500,
                color: '#8b90a0',
                border: '1px solid #1e2130',
                backgroundColor: 'transparent',
                transition: 'all 0.15s',
              }}>
                Properties
              </Link>
              <Link href="/properties/new" style={{
                textDecoration: 'none',
                padding: '6px 16px',
                borderRadius: '7px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#0c0e14',
                backgroundColor: '#d4a843',
              }}>
                Add Property
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