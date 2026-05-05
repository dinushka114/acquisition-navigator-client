import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AboutUs from './AboutUs';
describe('AboutUs Component', () => {
    it('renders the contact form headings', () => {
        render(
            <BrowserRouter>
                <AboutUs />
            </BrowserRouter>
        );

        expect(screen.getByText(/About Us/i)).toBeInTheDocument();
    });
});