// quiz/page.tsx
import Quiz from '@/components/Quiz'
import { client } from '@/sanity/lib/client'
import { useRouter } from 'next/router'
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

	// Check if the user has taken the quiz
	if (user?.data?.quizResults?.length > 0) {
		// Redirect to stats page
		router.push('/stats')
		return null // Return null to prevent rendering the quiz page
	}

	return (
		<>
			<Quiz questions={questions} userId={userId} />
		</>
	)
}

export default Page
