import Quiz from '@/components/Quiz'
import { client } from '@/sanity/lib/client'
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
	const questions = await getData()
	const user = await fetchUsers()
	const userId = user?.data.user.id

	return (
		<>
			<Quiz questions={questions} userId={userId} user={user} />
		</>
	)
}

export default Page
