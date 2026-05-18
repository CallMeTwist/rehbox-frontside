import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ExerciseVideoPlayer } from '../ExerciseVideoPlayer';

const renderPlayer = (props: Parameters<typeof ExerciseVideoPlayer>[0]) =>
  render(<MemoryRouter><ExerciseVideoPlayer {...props} /></MemoryRouter>);

describe('ExerciseVideoPlayer', () => {
  it('renders the locked overlay when isLocked', () => {
    renderPlayer({
      video: { source: 'upload', url: null, youtube_id: null },
      thumbnailUrl: '/x.jpg', isLocked: true, title: 'Glute Bridge',
    });
    expect(screen.getByRole('button', { name: /upgrade/i })).toBeInTheDocument();
  });

  it('renders a native video for upload source', () => {
    const { container } = renderPlayer({
      video: { source: 'upload', url: '/videos/x.mp4', youtube_id: null },
      thumbnailUrl: '/x.jpg', isLocked: false, title: 'X',
    });
    const video = container.querySelector('video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('src', '/videos/x.mp4');
  });

  it('renders a youtube iframe for youtube source', () => {
    const { container } = renderPlayer({
      video: { source: 'youtube', url: null, youtube_id: 'abc12345678' },
      thumbnailUrl: null, isLocked: false, title: 'X',
    });
    const iframe = container.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe?.getAttribute('src')).toContain('abc12345678');
    expect(iframe?.getAttribute('src')).toContain('youtube-nocookie.com');
  });

  it('renders the coming-soon placeholder when source is null', () => {
    renderPlayer({
      video: { source: null, url: null, youtube_id: null },
      thumbnailUrl: '/x.jpg', isLocked: false, title: 'X',
    });
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
  });
});
