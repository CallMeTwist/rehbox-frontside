import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FreeStreakPanel } from '../FreeStreakPanel';

describe('FreeStreakPanel', () => {
  it('shows current streak, longest streak, and 7 dots', () => {
    const { container } = render(
      <FreeStreakPanel current={5} longest={12} last7={[true, true, false, true, true, true, false]} />
    );
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText(/Longest: 12/i)).toBeInTheDocument();
    expect(container.querySelectorAll('[data-testid^="streak-dot"]').length).toBe(7);
    expect(container.querySelectorAll('[data-testid="streak-dot-active"]').length).toBe(5);
  });
});
