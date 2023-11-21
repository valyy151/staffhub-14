import '@/styles/globals.css'

import { Inter } from 'next/font/google'
import { cookies } from 'next/headers'

import NextTopLoader from 'nextjs-toploader'

import { TRPCReactProvider } from '@/trpc/react'
import { ThemeProvider } from './_components/theme-provider'
import { Toaster } from '@/app/_components/ui/toaster'

import Navbar from './_components/navbar'

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-sans',
})

export const metadata = {
	title: 'Create T3 App',
	description: 'Generated by create-t3-app',
	icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body className={`font-sans ${inter.variable}`}>
				<TRPCReactProvider cookies={cookies().toString()}>
					<ThemeProvider attribute='class'>
						<Navbar />
						<NextTopLoader showSpinner={false} />
						{children}
						<Toaster />
					</ThemeProvider>
				</TRPCReactProvider>
			</body>
		</html>
	)
}
