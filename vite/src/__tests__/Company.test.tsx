import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CompanyPage from '../pages/Company';

describe('CompanyPage', () => {
    it('renders company page with title', () => {
        render(<CompanyPage />);

        const title = screen.getByRole('heading', { name: '企業管理登録画面' });
        expect(title).toBeInTheDocument();
    });

    it('displays title in center of screen', () => {
        const { container } = render(<CompanyPage />);
        const mainDiv = container.firstChild as HTMLElement;

        expect(mainDiv).toHaveClass(
            'h-screen',
            'flex',
            'items-center',
            'justify-center'
        );
    });

    it('has proper heading styling', () => {
        render(<CompanyPage />);

        const title = screen.getByRole('heading', { name: '企業管理登録画面' });
        expect(title).toHaveClass(
            'text-2xl',
            'font-bold',
            'text-gray-800',
            'text-center'
        );
    });
});
