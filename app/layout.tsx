import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Folia PM - Gestão de Empresas',
  description: 'Sistema de gestão de processos e CRM',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
