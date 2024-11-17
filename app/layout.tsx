import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from './dashboard/(components)/ThemeProvider'
import ReactQueryProvider from '@/components/react-query-provider'
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PortMan',
  description: 'Portfolio Management Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ReactQueryProvider>
            {children}
            <Toaster position="bottom-right" expand={true} richColors />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html >
  )
}