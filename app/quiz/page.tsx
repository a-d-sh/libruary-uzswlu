import Quiz from '@/components/Quiz'
import { client } from '@/sanity/lib/client'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { fetchUsers } from '../(auth)/actions/fetchUsers'

export const dynamic = 'force-dynamic'

async function getData() {
	const query = `*[_type == "questions"] | order(_createdAt asc) {
    question,
    answers,
    correctAnswer
  }`

	const data = await client.fetch(query)

	return data
}

const Page = async () => {
	const router = useRouter()
	const questions = await getData()
	const user = await fetchUsers()
	const userId = user?.data.user.id

	useEffect(() => {
		if (user?.data?.quizResults?.length > 0) {
			router.push('/stats')
		}
	}, [user, router])

	return (
		<>
			<Quiz questions={questions} userId={userId} />
		</>
	)
}

export default Page
