import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FillInTheBlank from './FillInTheBlank'
import type { FillInTheBlankQuestion } from '../../types/exercise'

const question: FillInTheBlankQuestion = {
  id: 'q1',
  enunciat: 'La Maria va _eure aigua.',
  buits: [
    { posicio: 0, resposta_correcta: 'b', opcions: ['b', 'v'] },
  ],
  explicacio: "Beure s'escriu amb b.",
}

describe('FillInTheBlank', () => {
  it('renders the question text', () => {
    render(<FillInTheBlank pregunta={question} onAnswer={() => {}} />)
    expect(screen.getByText(/La Maria va/)).toBeInTheDocument()
  })

  it('renders a select with options when opcions are provided', () => {
    render(<FillInTheBlank pregunta={question} onAnswer={() => {}} />)
    const selects = screen.getAllByRole('combobox')
    expect(selects).toHaveLength(1)
  })

  it('shows submit button disabled when no answer is selected', () => {
    render(<FillInTheBlank pregunta={question} onAnswer={() => {}} />)
    const submitBtn = screen.getByRole('button', { name: /comprova/i })
    expect(submitBtn).toBeDisabled()
  })

  it('calls onAnswer(true) when correct answer is submitted', async () => {
    const user = userEvent.setup()
    const onAnswer = vi.fn()
    render(<FillInTheBlank pregunta={question} onAnswer={onAnswer} />)
    const select = screen.getByRole('combobox')
    await user.selectOptions(select, 'b')
    await user.click(screen.getByRole('button', { name: /comprova/i }))
    expect(onAnswer).toHaveBeenCalledWith(true)
  })

  it('calls onAnswer(false) when wrong answer is submitted', async () => {
    const user = userEvent.setup()
    const onAnswer = vi.fn()
    render(<FillInTheBlank pregunta={question} onAnswer={onAnswer} />)
    const select = screen.getByRole('combobox')
    await user.selectOptions(select, 'v')
    await user.click(screen.getByRole('button', { name: /comprova/i }))
    expect(onAnswer).toHaveBeenCalledWith(false)
  })

  it('shows "Correcte!" on correct answer', async () => {
    const user = userEvent.setup()
    render(<FillInTheBlank pregunta={question} onAnswer={() => {}} />)
    const select = screen.getByRole('combobox')
    await user.selectOptions(select, 'b')
    await user.click(screen.getByRole('button', { name: /comprova/i }))
    expect(screen.getByText('Correcte!')).toBeInTheDocument()
  })

  it('shows explicacio on wrong answer', async () => {
    const user = userEvent.setup()
    render(<FillInTheBlank pregunta={question} onAnswer={() => {}} />)
    const select = screen.getByRole('combobox')
    await user.selectOptions(select, 'v')
    await user.click(screen.getByRole('button', { name: /comprova/i }))
    expect(screen.getByText(/Beure s'escriu amb b/)).toBeInTheDocument()
  })

  it('validates case-insensitively for free text inputs', async () => {
    const user = userEvent.setup()
    const onAnswer = vi.fn()
    const freeQuestion: FillInTheBlankQuestion = {
      id: 'q2',
      enunciat: 'Jo _ els deures.',
      buits: [{ posicio: 0, resposta_correcta: 'faig' }],
      explicacio: 'Faig.',
    }
    render(<FillInTheBlank pregunta={freeQuestion} onAnswer={onAnswer} />)
    const input = screen.getByRole('textbox')
    await user.type(input, 'FAIG')
    await user.click(screen.getByRole('button', { name: /comprova/i }))
    expect(onAnswer).toHaveBeenCalledWith(true)
  })
})
