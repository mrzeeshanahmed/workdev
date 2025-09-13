import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TwoFactorSetup from './TwoFactorSetup'

describe('TwoFactorSetup', () => {
  it('renders title and start button', () => {
    render(<TwoFactorSetup userId="test-user" />)
    expect(screen.getByText('Two-factor setup')).toBeTruthy()
    expect(screen.getByText('Start 2FA setup')).toBeTruthy()
  })
})
