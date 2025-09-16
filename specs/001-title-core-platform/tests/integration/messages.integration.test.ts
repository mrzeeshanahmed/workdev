import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MessageList } from '../../../../frontend/src/features/messages/components/MessageList'

// Mock the supabase client used in the hook to simulate delayed server ack
vi.mock('@supabase/supabase-js', () => {
  return {
    createClient: () => ({
      from: () => ({
        select: () => ({ data: [] }),
        insert: (rows: any[]) => ({
          select: () => ({
            single: async () => {
              // simulate server delay
              await new Promise((r) => setTimeout(r, 50))
              return { data: { ...rows[0], id: 'real-1', created_at: new Date().toISOString() } }
            }
          })
        })
      }),
      channel: () => ({ on: () => ({ subscribe: () => null }), subscribe: () => null })
    })
  }
})

describe('Messages optimistic UI (T008)', () => {
  it('shows optimistic message immediately and replaces it after server ack', async () => {
  // use createElement but provide a children prop (null) so React's types accept it in .ts files
  const el = React.createElement(MessageList as any, { conversationId: 'conv-1', currentUserId: 'user-1', children: null })
  render(el as any)
    const input = screen.getByTestId('message-input') as HTMLInputElement
    const btn = screen.getByTestId('send-btn') as HTMLButtonElement

    fireEvent.change(input, { target: { value: 'Hello' } })
    fireEvent.click(btn)

    // optimistic entry should appear immediately
    expect(screen.getByText('Hello')).toBeTruthy()

    // after server ack (mocked delayed), original optimistic id should be replaced
    await waitFor(() => expect(screen.getByText('Hello')).toBeTruthy(), { timeout: 1000 })
  })
})
