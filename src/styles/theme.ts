// ReHboX Theme Constants
// These complement the CSS custom properties defined in index.css

export const brandColors = {
  primary: '#2C5FC3',
  hotPink: '#E8358A',
  dark: '#1A1A2E',
  white: '#FFFFFF',
} as const;

export const chartColors = {
  primary: 'hsl(var(--primary))',
  hotPink: 'hsl(var(--hot-pink))',
  success: 'hsl(var(--success))',
  warning: 'hsl(var(--warning))',
  muted: 'hsl(var(--muted-foreground))',
  border: 'hsl(var(--border))',
  card: 'hsl(var(--card))',
} as const;

export const tooltipStyle = {
  background: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '12px',
  fontSize: '12px',
} as const;
