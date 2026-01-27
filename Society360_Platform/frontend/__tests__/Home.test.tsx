import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../app/page';

describe('Home Page', () => {
    it('renders the getting started text', () => {
        render(<Home />);

        const heading = screen.getByText(/To get started, edit the/i);
        expect(heading).toBeInTheDocument();
    });

    it('renders the deploy link', () => {
        render(<Home />);

        const deployLink = screen.getByRole('link', { name: /Deploy Now/i });
        expect(deployLink).toHaveAttribute('href', 'https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app');
    });
});
