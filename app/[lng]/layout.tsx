import { ThemeProvider } from '@/components/providers/theme.provider'
import { Toaster } from '@/components/ui/sonner'
import { languages } from '@/i18n/settings'
import { localization } from '@/lib/utils'
import { ChildProps } from '@/types'
import { ClerkProvider } from '@clerk/nextjs'
import { GoogleAnalytics } from '@next/third-parties/google'
import { dir } from 'i18next'
import type { Metadata } from 'next'
import { Roboto, Space_Grotesk as SpaceGrotesk } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import './globals.css'

const roboto = Roboto({
	subsets: ['latin', 'cyrillic'],
	weight: ['100', '300', '400', '500', '700', '900'],
	variable: '--font-roboto',
})

const spaceGrotesk = SpaceGrotesk({
	weight: ['300', '400', '500', '600', '700'],
	subsets: ['latin'],
	variable: '--font-space-grotesk',
})

export async function generateStaticParams() {
	return languages.map(lng => ({ lng }))
}

export const metadata: Metadata = {
	metadataBase: new URL('https://digiiusi.uz'),
	title: 'Digital IUSI | Online o`qitish uchun platforma',
	description: 'Xalqaro innovatsion texnologiyalari universiteti',
	authors: [{ name: 'Abduvoxidov Davlatbek', url: 'https://t.me/adsh97' }],
	icons: { icon: '/logo.png' },
	openGraph: {
		title: 'Digital IUSI | Online o`qitish uchun platforma',
		description: 'Xalqaro innovatsion texnologiyalari universiteti',
		type: 'website',
		url: 'https://digiiusi.uz',
		locale: 'uz_UZ',
		images: '/logo.png',
		countryName: 'Uzbekistan',
		siteName: 'digiiusi.uz',
		emails: 'info@iusi.uz',
	},
	keywords:
		"Digi, iusi, iusi.uz, digi.iusi.uz, NextJS, online, o'qitish, NextJS dasturlash, Startup, Startup loyiha, Startup iusi, Iusi, Iusi digi,",
}

interface Props extends ChildProps {
	params: { lng: string }
}

function RootLayout({ children, params: { lng } }: Props) {
	const local = localization(lng)

	return (
		<ClerkProvider localization={local}>
			<html lang={lng} dir={dir(lng)} suppressHydrationWarning>
				<body
					className={`${roboto.variable} ${spaceGrotesk.variable} custom-scrollbar overflow-x-hidden`}
					suppressHydrationWarning
				>
					<ThemeProvider
						attribute='class'
						defaultTheme='system'
						enableSystem
						disableTransitionOnChange
					>
						<NextTopLoader
							color='#3182CE'
							initialPosition={0.5}
							crawlSpeed={200}
							height={2}
							crawl={true}
							showSpinner={false}
							easing='ease'
							speed={200}
							shadow='0 0 10px #3182CE,0 0 5px #3182CE'
						/>
						<Toaster position='top-center' />
						<div>{children}</div>
					</ThemeProvider>
				</body>
				<GoogleAnalytics gaId='G-9WVQMSX9GQ' />
			</html>
		</ClerkProvider>
	)
}

export default RootLayout
