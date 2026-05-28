import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { FreeTierLock } from '../FreeTierLock';

describe('FreeTierLock', () => {
  it('renders the headline and CTA for each feature variant', () => {
    render(
      <MemoryRouter>
        <FreeTierLock feature="plan" />
      </MemoryRouter>
    );
    expect(screen.getByText(/personalised plan/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /upgrade/i })).toHaveAttribute('href', '/upgrade');
  });

  it('renders the inline variant when prop set', () => {
    render(
      <MemoryRouter>
        <FreeTierLock feature="tracking" variant="inline" />
      </MemoryRouter>
    );
    expect(screen.getByText(/form feedback/i)).toBeInTheDocument();
  });
});
