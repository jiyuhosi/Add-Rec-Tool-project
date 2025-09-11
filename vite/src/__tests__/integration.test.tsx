import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('Integration Tests', () => {
    it('navigates from home to company page', async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        );

        // Check we're on home page
        expect(screen.getByText('企業管理登録画面')).toBeInTheDocument();
        expect(screen.getByText('会員管理登録画面')).toBeInTheDocument();

        // Navigate to company page via link
        const companyLink = screen.getByRole('link', {
            name: '企業管理登録画面',
        });
        await user.click(companyLink);

        // Check we're now on company page
        expect(
            screen.getByRole('heading', { name: '企業管理登録画面' })
        ).toBeInTheDocument();
    });

    it('navigates from home to member page', async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        );

        // Check we're on home page
        expect(screen.getByText('企業管理登録画面')).toBeInTheDocument();
        expect(screen.getByText('会員管理登録画面')).toBeInTheDocument();

        // Navigate to member page via link
        const memberLink = screen.getByRole('link', {
            name: '会員管理登録画面',
        });
        await user.click(memberLink);

        // Check we're now on member page
        expect(
            screen.getByRole('heading', { name: '会員管理登録画面' })
        ).toBeInTheDocument();
    });

    it('navigates using header navigation', async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        );

        // Navigate to company page via header
        const companyHeaderLink = screen.getByRole('link', { name: 'Company' });
        await user.click(companyHeaderLink);

        expect(
            screen.getByRole('heading', { name: '企業管理登録画面' })
        ).toBeInTheDocument();

        // Navigate to member page via header
        const memberHeaderLink = screen.getByRole('link', { name: 'Member' });
        await user.click(memberHeaderLink);

        expect(
            screen.getByRole('heading', { name: '会員管理登録画面' })
        ).toBeInTheDocument();

        // Navigate back to home via header
        const homeHeaderLink = screen.getByRole('link', { name: 'Home' });
        await user.click(homeHeaderLink);

        expect(screen.getByText('企業管理登録画面')).toBeInTheDocument();
        expect(screen.getByText('会員管理登録画面')).toBeInTheDocument();
    });
});
