import { jsx as _jsx } from "react/jsx-runtime";
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import PostProjectWizard from '../PostProjectWizard';
describe('PostProjectWizard', () => {
    test('validates required fields', () => {
        const onSubmit = vi.fn();
        render(_jsx(PostProjectWizard, { onSubmit: onSubmit }));
        // Try to advance without filling required fields
        fireEvent.click(screen.getByText('Next'));
        // validation messages are shown for title and description
        const required = screen.getAllByText('Required');
        expect(required.length).toBeGreaterThanOrEqual(2);
        expect(onSubmit).not.toHaveBeenCalled();
    });
    test('submits payload when valid', () => {
        const onSubmit = vi.fn();
        render(_jsx(PostProjectWizard, { onSubmit: onSubmit }));
        fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'My Project' } });
        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Do things' } });
        // go to next step
        fireEvent.click(screen.getByText('Next'));
        // add skills
        fireEvent.change(screen.getByLabelText('Skill input'), { target: { value: 'js' } });
        fireEvent.click(screen.getByText('Add'));
        fireEvent.change(screen.getByLabelText('Skill input'), { target: { value: 'react' } });
        fireEvent.click(screen.getByText('Add'));
        fireEvent.click(screen.getByText('Next'));
        // at review, submit
        fireEvent.click(screen.getByText('Post Project'));
        expect(onSubmit).toHaveBeenCalled();
        const payload = onSubmit.mock.calls[0][0];
        expect(payload.title).toBe('My Project');
        expect(payload.skills).toEqual(['js', 'react']);
    });
});
