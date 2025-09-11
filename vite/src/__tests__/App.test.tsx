import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App', () => {
    it('renders header component', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        );

        // Assuming Header component renders some content
        // You may need to adjust this based on your Header component implementation
        const header = document.querySelector('header');
        expect(header).toBeInTheDocument();
    });

    it('renders HomePage when route is /', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByText('企業管理登録画面')).toBeInTheDocument();
        expect(screen.getByText('会員管理登録画面')).toBeInTheDocument();
    });

    it('renders CompanyPage when route is /company', () => {
        render(
            <MemoryRouter initialEntries={['/company']}>
                <App />
            </MemoryRouter>
        );

        expect(
            screen.getByRole('heading', { name: '企業管理登録画面' })
        ).toBeInTheDocument();
    });

    it('renders MemberPage when route is /member', () => {
        render(
            <MemoryRouter initialEntries={['/member']}>
                <App />
            </MemoryRouter>
        );

        expect(
            screen.getByRole('heading', { name: '会員管理登録画面' })
        ).toBeInTheDocument();
    });
});
