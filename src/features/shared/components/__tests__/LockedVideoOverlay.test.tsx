import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LockedVideoOverlay } from '../LockedVideoOverlay';

describe('LockedVideoOverlay', () => {
  it('renders the upgrade CTA', () => {
    render(<LockedVideoOverlay thumbnailUrl="/x.jpg" onUpgrade={() => {}} />);
    expect(screen.getByRole('button', { name: /upgrade/i })).toBeInTheDocument();
  });

  it('calls onUpgrade when the CTA is tapped', () => {
    const onUpgrade = vi.fn();
    render(<LockedVideoOverlay thumbnailUrl="/x.jpg" onUpgrade={onUpgrade} />);
    fireEvent.click(screen.getByRole('button', { name: /upgrade/i }));
    expect(onUpgrade).toHaveBeenCalledOnce();
  });
});
