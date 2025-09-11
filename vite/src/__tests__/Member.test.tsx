import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MemberPage from '../pages/Member';

describe('MemberPage', () => {
    it('renders member page with title', () => {
        render(<MemberPage />);

        const title = screen.getByRole('heading', { name: '会員管理登録画面' });
        expect(title).toBeInTheDocument();
    });

    it('displays title in center of screen', () => {
        const { container } = render(<MemberPage />);
        const mainDiv = container.firstChild as HTMLElement;

        expect(mainDiv).toHaveClass(
            'h-screen',
            'flex',
            'items-center',
            'justify-center'
        );
    });

    it('has proper heading styling', () => {
        render(<MemberPage />);

        const title = screen.getByRole('heading', { name: '会員管理登録画面' });
        expect(title).toHaveClass(
            'text-2xl',
            'font-bold',
            'text-gray-800',
            'text-center'
        );
    });
});
