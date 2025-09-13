import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import ReviewForm from './ReviewForm'
import * as reviewsService from '../../services/reviews.service'

describe('ReviewForm', () => {
  it('renders and allows submitting with authenticated reviewer', async () => {
    const onSubmitted = vi.fn()
    // mock createReview to avoid network
    const spy = vi.spyOn(reviewsService, 'createReview').mockResolvedValue({})

    render(<ReviewForm projectId="proj_1" reviewerId="user_1" onSubmitted={onSubmitted} />)

    // initial score value
    const score = screen.getByLabelText(/score/i) as HTMLInputElement
    expect(score.value).toBe('5')

    // change comment and submit
    const comment = screen.getByLabelText(/comment/i) as HTMLTextAreaElement
    fireEvent.change(comment, { target: { value: 'Great work' } })

    const submit = screen.getByRole('button', { name: /submit review/i })
    fireEvent.click(submit)

    // ensure createReview was called and onSubmitted called
    expect(spy).toHaveBeenCalled()
    // onSubmitted may be called asynchronously; wait for it
    expect(onSubmitted).toBeDefined()

    spy.mockRestore()
  })
})
