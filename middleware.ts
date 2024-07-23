import { authMiddleware } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export default authMiddleware({
	publicRoutes: [],
	afterAuth(auth, req) {
		if (!auth.userId) {
			const signInUrl = 'https://accounts.digiiusi.uz/sign-in'
			return NextResponse.redirect(signInUrl)
		}
	},
})

export const config = {
	matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
