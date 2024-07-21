import LayoutProvider from '@/providers/LayoutProvider'
import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Raleway } from 'next/font/google'
import './globals.css'

const raleway = Raleway({
	subsets: ['latin'],
	weight: ['200', '300', '400', '500', '600', '700', '900'],
})

export const metadata: Metadata = {
	title: 'CodeQuiz',
	description: 'Weekly quiz question for developers',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<ClerkProvider
			frontendApi={process.env.NEXT_PUBLIC_CLERK_FRONTEND_API}
			domain={process.env.NEXT_PUBLIC_CLERK_SUBDOMAIN}
		>
			<html lang='en'>
				<body className={`${raleway.className} min-h-screen`}>
					<LayoutProvider>{children}</LayoutProvider>
				</body>
			</html>
		</ClerkProvider>
	)
}
