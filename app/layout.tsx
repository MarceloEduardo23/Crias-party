import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Boogaloo, Poppins, Geist_Mono } from 'next/font/google'
import { SoundProvider } from '@/components/sound-provider'
import './globals.css'

const boogaloo = Boogaloo({
  variable: '--font-boogaloo',
  subsets: ['latin'],
  weight: ['400'],
})

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Crias Party 🎉',
  description: 'O jogo de festa mais caótico da turma. Junte a galera, conecte os celulares e dispute Vinte e Um, Impostor e Quiz!',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0f0c1a',
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`dark ${boogaloo.variable} ${poppins.variable} ${geistMono.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <SoundProvider>{children}</SoundProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
