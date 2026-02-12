import './globals.css'
import Link from 'next/link'


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ minHeight: '100vh', backgroundColor: '#0c0e14' }}>
        <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
          {children}
        </main>
      </body>
    </html>
  )
}