import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Header from '../components/Header';

const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Header', () => {
    it('renders all navigation links', () => {
        renderWithRouter(<Header />);

        expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
        expect(
            screen.getByRole('link', { name: 'Company' })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('link', { name: 'Member' })
        ).toBeInTheDocument();
    });

    it('has correct href attributes for navigation links', () => {
        renderWithRouter(<Header />);

        expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
            'href',
            '/'
        );
        expect(screen.getByRole('link', { name: 'Company' })).toHaveAttribute(
            'href',
            '/company'
        );
        expect(screen.getByRole('link', { name: 'Member' })).toHaveAttribute(
            'href',
            '/member'
        );
    });

    it('renders as header element', () => {
        renderWithRouter(<Header />);

        const header = screen.getByRole('banner');
        expect(header).toBeInTheDocument();
    });

    it('has proper navigation structure', () => {
        renderWithRouter(<Header />);

        const nav = screen.getByRole('navigation');
        expect(nav).toBeInTheDocument();
        expect(nav).toHaveClass('flex', 'items-center', 'justify-between');
    });
});
