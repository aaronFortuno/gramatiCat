import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MultipleChoice from './MultipleChoice'
import type { MultipleChoiceQuestion } from '../../types/exercise'

const question: MultipleChoiceQuestion = {
  id: 'q1',
  enunciat: 'Quina és la forma correcta?',
  opcions: ['cafè', 'café', 'cafe'],
  resposta_correcta: 0,
  explicacio: "Cafè porta accent obert.",
}

function getOptionButton(name: RegExp) {
  return screen.getByRole('button', { name })
}

describe('MultipleChoice', () => {
  it('renders the question and all options', () => {
    render(<MultipleChoice pregunta={question} onAnswer={() => {}} />)
    expect(screen.getByText('Quina és la forma correcta?')).toBeInTheDocument()
    expect(getOptionButton(/cafè/)).toBeInTheDocument()
    expect(getOptionButton(/café/)).toBeInTheDocument()
    expect(getOptionButton(/cafe$/)).toBeInTheDocument()
  })

  it('shows submit button disabled until an option is selected', () => {
    render(<MultipleChoice pregunta={question} onAnswer={() => {}} />)
    const submitBtn = screen.getByRole('button', { name: /comprova/i })
    expect(submitBtn).toBeDisabled()
  })

  it('enables submit after selecting an option', async () => {
    const user = userEvent.setup()
    render(<MultipleChoice pregunta={question} onAnswer={() => {}} />)
    await user.click(getOptionButton(/cafè/))
    const submitBtn = screen.getByRole('button', { name: /comprova/i })
    expect(submitBtn).not.toBeDisabled()
  })

  it('calls onAnswer(true) when correct option is submitted', async () => {
    const user = userEvent.setup()
    const onAnswer = vi.fn()
    render(<MultipleChoice pregunta={question} onAnswer={onAnswer} />)
    await user.click(getOptionButton(/cafè/))
    await user.click(screen.getByRole('button', { name: /comprova/i }))
    expect(onAnswer).toHaveBeenCalledWith(true)
  })

  it('calls onAnswer(false) when wrong option is submitted', async () => {
    const user = userEvent.setup()
    const onAnswer = vi.fn()
    render(<MultipleChoice pregunta={question} onAnswer={onAnswer} />)
    await user.click(getOptionButton(/café/))
    await user.click(screen.getByRole('button', { name: /comprova/i }))
    expect(onAnswer).toHaveBeenCalledWith(false)
  })

  it('shows "Correcte!" feedback on correct answer', async () => {
    const user = userEvent.setup()
    render(<MultipleChoice pregunta={question} onAnswer={() => {}} />)
    await user.click(getOptionButton(/cafè/))
    await user.click(screen.getByRole('button', { name: /comprova/i }))
    expect(screen.getByText('Correcte!')).toBeInTheDocument()
  })

  it('shows "Incorrecte" feedback and explicacio on wrong answer', async () => {
    const user = userEvent.setup()
    render(<MultipleChoice pregunta={question} onAnswer={() => {}} />)
    await user.click(getOptionButton(/café/))
    await user.click(screen.getByRole('button', { name: /comprova/i }))
    expect(screen.getByText('Incorrecte')).toBeInTheDocument()
    expect(screen.getByText(/accent obert/)).toBeInTheDocument()
  })

  it('disables option buttons after answering', async () => {
    const user = userEvent.setup()
    render(<MultipleChoice pregunta={question} onAnswer={() => {}} />)
    await user.click(getOptionButton(/cafè/))
    await user.click(screen.getByRole('button', { name: /comprova/i }))
    // After answering, option buttons should be disabled
    expect(getOptionButton(/cafè/)).toBeDisabled()
    expect(getOptionButton(/café/)).toBeDisabled()
  })

  it('hides submit button after answering', async () => {
    const user = userEvent.setup()
    render(<MultipleChoice pregunta={question} onAnswer={() => {}} />)
    await user.click(getOptionButton(/cafè/))
    await user.click(screen.getByRole('button', { name: /comprova/i }))
    expect(screen.queryByRole('button', { name: /comprova/i })).not.toBeInTheDocument()
  })
})
