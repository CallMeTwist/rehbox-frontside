// ReHboX Theme Constants
// These complement the CSS custom properties defined in index.css

export const brandColors = {
  primary:      '#1B3E8F',
  primaryMid:   '#2C5FC3',
  primaryDark:  '#0F2557',
  primaryLight: '#E8EEFF',
  hotPink:      '#E5197D',
  hotPinkSoft:  '#FF6BB5',
  hotPinkDeep:  '#C4006A',
  coin:         '#F4A100',
  dark:         '#0F2557',
  white:        '#FFFFFF',
  offWhite:     '#F4F7FF',
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
