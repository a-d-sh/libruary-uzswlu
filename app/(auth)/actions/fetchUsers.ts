'use server'
import { prisma } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs'

export const fetchUsers = async () => {
	try {
		const clerkUser = await currentUser()
		if (!clerkUser) {
			throw new Error('No current user found')
		}

		// Foydalanuvchini bazadan qidirish
		let mongoUser = await prisma.user.findUnique({
			where: {
				clerkUserId: clerkUser.id,
			},
		})

		// Foydalanuvchi topilmasa, yangi foydalanuvchi yaratish
		if (!mongoUser) {
			const username =
				clerkUser.username ||
				`${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`
			const email =
				clerkUser.emailAddresses.length > 0
					? clerkUser.emailAddresses[0].emailAddress
					: `${clerkUser.id}@noemail.com`

			const newUser = {
				clerkUserId: clerkUser.id,
				username,
				email,
				profilePic: clerkUser.imageUrl || '',
			}

			mongoUser = await prisma.user.create({
				data: newUser,
			})
		}

		// Foydalanuvchi uchun quiz natijalarini olish
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
		console.error('Error fetching users:', error)
		throw new Error('Failed to fetch user data')
	}
}
