import { ModalProvider } from '@/components/providers/modal-provider'
import { SocketProvider } from '@/components/providers/socket-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { cn } from '@/lib/utils'
import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/components/providers/query-provider'
import { Toaster, toast } from 'sonner'

const font = Noto_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Brainwave',
  description: 'F29SO Group 9',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn (
          font.className,
          "bg-[rgb(244,244,244)] dark:bg-[rgb(3,2,66)]"
          )}>
          <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem
          storageKey='brainwave-theme'
          >
            <SocketProvider>
              <ModalProvider/>
              <QueryProvider>
                {children}
              </QueryProvider>
              <Toaster />
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
