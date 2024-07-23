import { authMiddleware, Redirect } from '@clerk/nextjs'

export default authMiddleware({
	async requireSignIn({ event, resolver }) {
		const user = await resolver.session.user()
		if (!user) {
			return Redirect.to('https://accounts.digiiusi.uz/sign-in')
		}
	},
})

export const config = {
	matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
