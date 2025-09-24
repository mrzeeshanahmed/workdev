import { jsx as _jsx } from "react/jsx-runtime";
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import PostProjectWizard from '../PostProjectWizard';
import '@testing-library/jest-dom';
describe('PostProjectWizard integration', () => {
    test('full wizard posts payload to /api/projects', async () => {
        const fakeFetch = vi.fn(async (input, init) => {
            expect(input).toBe('/api/projects');
            const body = JSON.parse(init.body);
            expect(body.title).toBe('Project X');
            expect(body.skills).toEqual(['react', 'node']);
            return new Response(JSON.stringify({ id: 'p1' }), { status: 201, headers: { 'Content-Type': 'application/json' } });
        });
        render(_jsx(PostProjectWizard, { fetchImpl: fakeFetch }));
        // Step 1
        fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Project X' } });
        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Build it' } });
        fireEvent.click(screen.getByText('Next'));
        // Step 2 - add skills
        fireEvent.change(screen.getByLabelText('Skill input'), { target: { value: 'react' } });
        fireEvent.click(screen.getByText('Add'));
        fireEvent.change(screen.getByLabelText('Skill input'), { target: { value: 'node' } });
        fireEvent.click(screen.getByText('Add'));
        fireEvent.click(screen.getByText('Next'));
        // Step 3 - budget and submit
        fireEvent.change(screen.getByLabelText('Budget Min'), { target: { value: '1000' } });
        fireEvent.change(screen.getByLabelText('Budget Max'), { target: { value: '5000' } });
        fireEvent.click(screen.getByText('Post Project'));
        await waitFor(() => expect(fakeFetch).toHaveBeenCalled());
    });
});
