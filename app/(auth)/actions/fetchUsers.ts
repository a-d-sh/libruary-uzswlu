'use server'
import { prisma } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs'

export const fetchUsers = async () => {
	try {
		const clerkUser = await currentUser()
		let mongoUser = null
		mongoUser = await prisma.user.findUnique({
			where: {
				clerkUserId: clerkUser?.id,
			},
		})

		if (!mongoUser) {
			let username = clerkUser?.username
			if (!username) {
				username = clerkUser?.firstName + ' ' + clerkUser?.lastName
			}
			const email =
				clerkUser?.emailAddresses.length > 0
					? clerkUser.emailAddresses[0].emailAddress
					: `${clerkUser?.id}@noemail.com`
			const newUser: any = {
				clerkUserId: clerkUser?.id,
				username,
				email,
				profilePic: clerkUser?.imageUrl,
			}
			mongoUser = await prisma.user.create({
				data: newUser,
			})
		}

		const quizResults = await prisma.quizResult.findMany({
			where: {
				userId: mongoUser.id,
			},
		})

		return {
			data: {
				user: mongoUser,
				quizResults,
			},
		}
	} catch (error) {
		console.log(error)
	}
}
