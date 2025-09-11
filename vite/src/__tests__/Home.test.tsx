import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import HomePage from '../pages/Home';

// Test utility function to wrap components with Router
const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('HomePage', () => {
    it('renders homepage with both navigation links', () => {
        renderWithRouter(<HomePage />);

        // Check if both links are present
        expect(screen.getByText('企業管理登録画面')).toBeInTheDocument();
        expect(screen.getByText('会員管理登録画面')).toBeInTheDocument();
    });

    it('has correct navigation links', () => {
        renderWithRouter(<HomePage />);

        const companyLink = screen.getByRole('link', {
            name: '企業管理登録画面',
        });
        const memberLink = screen.getByRole('link', {
            name: '会員管理登録画面',
        });

        expect(companyLink).toHaveAttribute('href', '/company');
        expect(memberLink).toHaveAttribute('href', '/member');
    });

    it('has proper styling classes for layout', () => {
        const { container } = renderWithRouter(<HomePage />);
        const mainDiv = container.firstChild as HTMLElement;

        expect(mainDiv).toHaveClass(
            'h-screen',
            'flex',
            'items-center',
            'justify-center',
            'gap-10'
        );
    });
});
