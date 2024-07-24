'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import sanitizeHtml from 'sanitize-html'
import StatCard from './StatCard'

interface QuizProps {
	questions: {
		question: string
		answers: string[]
		correctAnswer: string
	}[]
	userId: string | undefined
	user: {
		data: {
			user: {
				id: string
				username: string
				email: string | null
				profilePic: string
				clerkUserId: string
				createdAt: Date
				updatedAt: Date
			}
			quizResults: any[] // Ma'lumotlaringizning haqiqiy tuzilishiga moslashtiring
		}
	}
}

const Quiz = ({ questions, userId, user }: QuizProps) => {
	const router = useRouter()

	useEffect(() => {
		if (user?.data?.quizResults?.length > 0) {
			router.push('/stats')
		}
	}, [user, router])

	const [activeQuestion, setActiveQuestion] = useState(0)
	const [selectedAnswer, setSelectedAnswer] = useState('')
	const [checked, setChecked] = useState(false)
	const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(
		null
	)
	const [showResults, setShowResults] = useState(false)
	const [results, setResults] = useState({
		score: 0,
		correctAnswers: 0,
		wrongAnswers: 0,
	})
	const [totalTimeRemaining, setTotalTimeRemaining] = useState(900) // 15 daqiqa = 900 sekund
	const [timerRunning, setTimerRunning] = useState(false)
	const [timeUp, setTimeUp] = useState(false)

	const { question, answers, correctAnswer } = questions[activeQuestion]

	useEffect(() => {
		let timer: NodeJS.Timeout
		if (timerRunning && totalTimeRemaining > 0) {
			timer = setTimeout(() => {
				setTotalTimeRemaining(prevTime => prevTime - 1)
			}, 1000)
		} else if (totalTimeRemaining === 0) {
			handleTimeUp()
		}
		return () => clearTimeout(timer)
	}, [timerRunning, totalTimeRemaining])

	const startTimer = () => {
		setTimerRunning(true)
	}

	const stopTimer = () => {
		setTimerRunning(false)
	}

	const handleTimeUp = () => {
		setTimeUp(true)
		stopTimer()
		setShowResults(true)
		saveQuizResults(results)
	}

	useEffect(() => {
		startTimer()

		return () => {
			stopTimer()
		}
	}, [])

	const onAnswerSelected = (answer: string, idx: number) => {
		setChecked(true)
		setSelectedAnswerIndex(idx)
		if (answer === correctAnswer) {
			setSelectedAnswer(answer)
		} else {
			setSelectedAnswer('')
		}
	}

	const nextQuestion = () => {
		if (!timeUp) {
			setSelectedAnswerIndex(null)
			const newResults = selectedAnswer
				? {
						...results,
						score: results.score + 5,
						correctAnswers: results.correctAnswers + 1,
					}
				: {
						...results,
						wrongAnswers: results.wrongAnswers + 1,
					}
			setResults(newResults)

			if (activeQuestion !== questions.length - 1) {
				setActiveQuestion(prev => prev + 1)
			} else {
				setShowResults(true)
				stopTimer()
				saveQuizResults(newResults)
			}
			setChecked(false)
		}
	}

	const saveQuizResults = (results: {
		score: number
		correctAnswers: number
		wrongAnswers: number
	}) => {
		fetch('/api/quizResults', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userId: userId,
				quizScore: results.score,
				correctAnswers: results.correctAnswers,
				wrongAnswers: results.wrongAnswers,
			}),
		})
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response was not ok')
				}
				return response.json()
			})
			.then(data => {
				console.log('Quiz results saved successfully:', data)
			})
			.catch(error => {
				console.error('Error saving quiz results:', error)
			})
	}

	const sanitizedQuestion = sanitizeHtml(question, {
		allowedTags: sanitizeHtml.defaults.allowedTags.concat(['div', 'p']),
		allowedAttributes: {
			'*': ['class'],
		},
	})

	return (
		<div className='min-h-[500px]'>
			<div className='max-w-[1500px] mx-auto w-[90%] flex justify-center py-10 flex-col'>
				{!showResults ? (
					<>
						<div className='flex justify-between mb-10 items-center'>
							<div className='bg-primary text-white px-4 rounded-md py-1'>
								<h2>
									Question: {activeQuestion + 1}
									<span>/{questions.length}</span>
								</h2>
							</div>

							<div className='bg-primary text-white px-4 rounded-md py-1'>
								{totalTimeRemaining} seconds remaining
							</div>
						</div>

						<div>
							<p
								className='mb-5 text-2xl'
								dangerouslySetInnerHTML={{ __html: sanitizedQuestion }}
							></p>
							<ul>
								{answers.map((answer: string, idx: number) => (
									<li
										key={idx}
										onClick={() => onAnswerSelected(answer, idx)}
										className={`cursor-pointer mb-5 py-3 rounded-md hover:bg-primary hover:text-white px-3
                      ${selectedAnswerIndex === idx && 'bg-primary text-white'}
                      `}
									>
										<span>{answer}</span>
									</li>
								))}
							</ul>
							<button
								onClick={nextQuestion}
								disabled={!checked}
								className='font-bold flex justify-center mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700'
							>
								{activeQuestion === questions.length - 1
									? 'Finish'
									: 'Next Question →'}
							</button>
						</div>
					</>
				) : (
					<div className='text-center'>
						<h3 className='text-2xl uppercase mb-10'>Results 📈</h3>
						<div className='grid lg:grid-cols-3 md:grid-cols-2 gap-10'>
							<StatCard
								title='Correct Answers'
								value={results.correctAnswers}
							/>
							<StatCard title='Wrong Answers' value={results.wrongAnswers} />
							<StatCard title='Total Questions' value={questions.length} />
						</div>
						<div className='grid lg:grid-cols-1 md:grid-cols-2 gap-10 mt-8'>
							<StatCard title=' Total Score' value={`${results.score}`} />
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default Quiz
