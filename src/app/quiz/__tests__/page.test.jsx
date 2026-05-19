import { render, screen } from '@testing-library/react'
import QuizPage from '../page'

jest.mock('@/components/Quiz', () => () => <div data-testid="quiz-component">Quiz</div>)

describe('QuizPage', () => {
  it('se rend sans erreur', () => {
    render(<QuizPage />)
  })

  it('affiche le composant Quiz', () => {
    render(<QuizPage />)
    expect(screen.getByTestId('quiz-component')).toBeInTheDocument()
  })
})
