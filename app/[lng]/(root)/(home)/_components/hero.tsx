'use client'

import useTranslate from '@/hooks/use-translate'

function Hero() {
	const t = useTranslate()

	return (
		<>
			<div className='container mx-auto grid min-h-[80vh] max-w-6xl grid-cols-2 gap-8 max-md:grid-cols-1 max-md:pt-32'>
				<div className='flex flex-col space-y-4 self-center'></div>
			</div>
		</>
	)
}

export default Hero
