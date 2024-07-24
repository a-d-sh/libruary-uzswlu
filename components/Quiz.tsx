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
			quizResults: any[]
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

	const [activeQuestion, setActiveQuestion] = useState(() => {
		const savedQuestion = localStorage.getItem('activeQuestion')
		return savedQuestion ? parseInt(savedQuestion) : 0
	})
	const [selectedAnswer, setSelectedAnswer] = useState('')
	const [checked, setChecked] = useState(false)
	const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(
		null
	)
	const [showResults, setShowResults] = useState(false)
	const [results, setResults] = useState(() => {
		const savedResults = localStorage.getItem('quizResults')
		return savedResults
			? JSON.parse(savedResults)
			: { score: 0, correctAnswers: 0, wrongAnswers: 0 }
	})
	const [totalTimeRemaining, setTotalTimeRemaining] = useState(900)
	const [timerRunning, setTimerRunning] = useState(false)
	const [timeUp, setTimeUp] = useState(false)

	const { question, answers, correctAnswer } = questions[activeQuestion]

	useEffect(() => {
		localStorage.setItem('activeQuestion', activeQuestion.toString())
	}, [activeQuestion])

	useEffect(() => {
		localStorage.setItem('quizResults', JSON.stringify(results))
	}, [results])

	useEffect(() => {
		const startTime = localStorage.getItem('quizStartTime')
		let interval: NodeJS.Timeout
		if (startTime) {
			const elapsed = Math.floor((Date.now() - parseInt(startTime)) / 1000)
			const remaining = 900 - elapsed
			setTotalTimeRemaining(remaining)
			if (remaining > 0) {
				interval = setInterval(() => {
					setTotalTimeRemaining(prevTime => {
						const newTime = prevTime - 1
						if (newTime <= 0) {
							handleTimeUp()
							clearInterval(interval)
						}
						return newTime
					})
				}, 1000)
			} else {
				handleTimeUp()
			}
		} else {
			localStorage.setItem('quizStartTime', Date.now().toString())
			interval = setInterval(() => {
				setTotalTimeRemaining(prevTime => {
					const newTime = prevTime - 1
					if (newTime <= 0) {
						handleTimeUp()
						clearInterval(interval)
					}
					return newTime
				})
			}, 1000)
		}

		return () => clearInterval(interval)
	}, [])

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60)
		const remainingSeconds = seconds % 60
		return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
			.toString()
			.padStart(2, '0')}`
	}

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

	const handleTimeUp = () => {
		setTimeUp(true)
		setShowResults(true)
		saveQuizResults(results)
		clearLocalStorage()
	}

	const clearLocalStorage = () => {
		localStorage.removeItem('activeQuestion')
		localStorage.removeItem('quizResults')
		localStorage.removeItem('quizStartTime')
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
								{formatTime(totalTimeRemaining)} remaining
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
