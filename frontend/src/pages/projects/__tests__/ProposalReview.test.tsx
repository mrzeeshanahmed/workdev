import React from 'react'
import '@testing-library/jest-dom'
import { render, fireEvent, screen } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'
import ProposalReview from '../ProposalReview'

describe('ProposalReview', ()=>{
  test('renders no proposals message', ()=>{
    render(<ProposalReview proposals={[]} />)
    expect(screen.getByText('No proposals')).toBeInTheDocument()
  })

  test('renders proposals and shortlists', ()=>{
    const onShortlist = vi.fn()
    const proposals = [{ id: 'p1', applicant_name: 'Alice', cover_letter: 'I can help', bid: 500 }]
    render(<ProposalReview proposals={proposals} onShortlist={onShortlist} />)
    expect(screen.getByTestId('proposal-p1')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Shortlist'))
    expect(onShortlist).toHaveBeenCalledWith('p1')
  })
})
