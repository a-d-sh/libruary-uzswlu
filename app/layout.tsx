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
	title: 'Quiz platforma',
	description: 'English test',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<ClerkProvider>
			<html lang='en'>
				<head>
					<title>{metadata.title}</title>
					<meta name='description' content={metadata.description} />
					<style>{`body { ${raleway.className} min-h-screen; }`}</style>
					<link rel='preconnect' href='https://fonts.gstatic.com' />
					<link href={raleway.href} rel='stylesheet' />
				</head>
				<body className='min-h-screen'>
					<LayoutProvider>{children}</LayoutProvider>
				</body>
			</html>
		</ClerkProvider>
	)
}
