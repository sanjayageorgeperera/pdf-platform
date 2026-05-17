'use client'

import { useState } from 'react'
import { submitQuizScore } from './actions'

interface Question {
  id: string
  question_text: string
  options: string[]
}

interface QuizContainerProps {
  documentId: string
  quiz: {
    id: string
    title: string
  }
  questions: Question[]
}

export default function QuizContainer({ documentId, quiz, questions }: QuizContainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1

  const handleSelectOption = (option: string) => {
    const updated = [...selectedAnswers]
    updated[currentIndex] = option
    setSelectedAnswers(updated)
  }

  const handleNext = () => {
    if (!selectedAnswers[currentIndex]) return // Require selecting an option
    setCurrentIndex((prev) => prev + 1)
  }

  const handleBack = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleSubmit = async () => {
    if (!selectedAnswers[currentIndex]) return
    setIsSubmitting(true)
    try {
      await submitQuizScore(documentId, quiz.id, selectedAnswers)
    } catch (err) {
      console.error(err)
      setIsSubmitting(false)
    }
  }

  const progressPercentage = ((currentIndex + 1) / questions.length) * 100

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto', borderLeft: '3px solid var(--accent)' }}>
      {/* Progress Bar */}
      <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginBottom: '1.5rem', overflow: 'hidden' }}>
        <div style={{ width: `${progressPercentage}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.3s ease' }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.6, marginBottom: '1.5rem' }}>
        <span>{quiz.title}</span>
        <span>Question {currentIndex + 1} of {questions.length}</span>
      </div>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4, marginBottom: '2rem' }}>
        {currentQuestion.question_text}
      </h2>

      {/* Options Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {currentQuestion.options.map((option) => {
          const isSelected = selectedAnswers[currentIndex] === option
          return (
            <button
              key={option}
              type="button"
              onClick={() => handleSelectOption(option)}
              style={{
                width: '100%',
                padding: '1rem 1.25rem',
                textAlign: 'left',
                borderRadius: '8px',
                border: isSelected ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.08)',
                background: isSelected ? 'rgba(var(--accent-rgb, 108, 92, 231), 0.15)' : 'rgba(255,255,255,0.02)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.95rem',
                transition: 'all 0.2s ease',
                outline: 'none',
                boxShadow: isSelected ? '0 0 12px rgba(var(--accent-rgb, 108, 92, 231), 0.1)' : 'none'
              }}
              className="hover:scale-[1.01]"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  border: isSelected ? '2px solid var(--accent)' : '2px solid rgba(255,255,255,0.3)',
                  background: isSelected ? 'var(--accent)' : 'none',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  color: isSelected ? 'white' : 'inherit'
                }}>
                  {isSelected ? '✓' : ''}
                </span>
                {option}
              </div>
            </button>
          )
        })}
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          type="button"
          onClick={handleBack}
          disabled={currentIndex === 0 || isSubmitting}
          style={{
            padding: '0.6rem 1.25rem',
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
            opacity: currentIndex === 0 ? 0.3 : 0.8,
            fontSize: '0.9rem'
          }}
        >
          Back
        </button>

        {isLastQuestion ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedAnswers[currentIndex] || isSubmitting}
            style={{
              padding: '0.6rem 1.5rem',
              background: 'var(--success)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: (!selectedAnswers[currentIndex] || isSubmitting) ? 'not-allowed' : 'pointer',
              opacity: (!selectedAnswers[currentIndex] || isSubmitting) ? 0.5 : 1,
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quiz 🚀'}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            disabled={!selectedAnswers[currentIndex]}
            style={{
              padding: '0.6rem 1.5rem',
              background: 'var(--accent)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: !selectedAnswers[currentIndex] ? 'not-allowed' : 'pointer',
              opacity: !selectedAnswers[currentIndex] ? 0.5 : 1,
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  )
}
