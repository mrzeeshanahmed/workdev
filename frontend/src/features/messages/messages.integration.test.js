import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
afterEach(() => cleanup());
// Ensure module-level supabase factory in useMessages picks up a non-empty URL/key
process.env.VITE_SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'http://test';
process.env.VITE_SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'anon';
// Mock the supabase client used in the hook to simulate delayed server ack
vi.mock('@supabase/supabase-js', () => {
    return {
        createClient: () => ({
            from: () => ({
                select: () => ({
                    eq: () => ({
                        order: async () => ({ data: [] })
                    })
                }),
                insert: (_rows) => ({
                    select: () => ({
                        single: async () => {
                            // simulate server delay
                            await new Promise((r) => setTimeout(r, 50));
                            return { data: { ..._rows[0], id: 'real-1', created_at: new Date().toISOString() } };
                        }
                    })
                })
            }),
            channel: () => ({ on: () => ({ subscribe: () => null }), subscribe: () => null, remove: () => null }),
            removeChannel: () => null
        })
    };
});
import { MessageList } from './components/MessageList';
describe('Messages optimistic UI (frontend-local)', () => {
    it('shows optimistic message immediately when sending', async () => {
        render(_jsx(MessageList, { conversationId: "conv-1", currentUserId: "user-1" }));
        const input = screen.getByTestId('message-input');
        const btn = screen.getByTestId('send-btn');
        fireEvent.change(input, { target: { value: 'Hello' } });
        fireEvent.click(btn);
        // optimistic entry should appear immediately
        expect(screen.getByText('Hello')).toBeTruthy();
    });
    it('rolls back optimistic message when server rejects insert', async () => {
        // Clear module cache so our fresh mock is used when importing the component
        vi.resetModules();
        // prepare env
        process.env.VITE_SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'http://test';
        process.env.VITE_SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'anon';
        // Mock supabase to return an error on insert
        vi.mock('@supabase/supabase-js', () => {
            return {
                createClient: () => ({
                    from: () => ({
                        select: () => ({ eq: () => ({ order: async () => ({ data: [] }) }) }),
                        insert: (_rows) => ({
                            select: () => ({ single: async () => ({ data: null, error: { message: 'boom' } }) })
                        })
                    }),
                    channel: () => ({ on: () => ({ subscribe: () => null }), subscribe: () => null, remove: () => null }),
                    removeChannel: () => null
                })
            };
        });
        // Dynamically import the component after mock and env are set so module-level client uses mock
        const { MessageList: DynamicMessageList } = await import('./components/MessageList');
        render(React.createElement(DynamicMessageList, { conversationId: 'conv-err', currentUserId: 'user-1' }));
        const input = screen.getByTestId('message-input');
        const btn = screen.getByTestId('send-btn');
        fireEvent.change(input, { target: { value: 'FailMe' } });
        fireEvent.click(btn);
        // optimistic entry should appear immediately
        expect(screen.getByText('FailMe')).toBeTruthy();
        // after server error, optimistic message should be removed
        await waitFor(() => expect(screen.queryByText('FailMe')).toBeNull(), { timeout: 1000 });
    });
});
