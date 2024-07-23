import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
	publicRoutes: [],
	redirectTo: 'https://accounts.digiiusi.uz/sign-in',
})

export const config = {
	matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
