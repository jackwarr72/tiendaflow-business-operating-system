---
name: TiendaFlow
description: Dark-mode visual identity for the TiendaFlow mobile operating system — a dualtone icon system on a warm-neutral surface palette.
status: draft
updated: '2026-10-06'

colors:
  #FBF9F4: surface-base
  #F1EDE6: surface-soft
  #E6E0D6: surface-line
  #1A1917: ink
  #6B655C: ink-soft
  #9B9388: ink-faint
  #4338CA: primary
  #6366F1: primary-soft
  #F59E0B: accent
  #22C55E: success
  #EF4444: danger
  #0D0D0C: surface-base-dark
  #161513: surface-soft-dark
  #24231F: surface-line-dark
  #F4F1EA: ink-dark
  #B5AE9E: ink-soft-dark
  #8A8377: ink-faint-dark
  #818CF8: primary-dark
  #A5B4FC: primary-soft-dark
  #FBBF24: accent-dark
  #4ADE80: success-dark
  #F87171: danger-dark

typography:
  display:
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    fontSize: '2rem'
    fontWeight: '700'
    lineHeight: '1.1'
  heading:
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    fontSize: '1.125rem'
    fontWeight: '600'
    lineHeight: '1.25'
  body:
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    fontSize: '0.9375rem'
    fontWeight: '400'
    lineHeight: '1.5'
  label:
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    fontSize: '0.75rem'
    fontWeight: '500'
    lineHeight: '1.33'
  mono:
    fontFamily: 'JetBrains Mono, ui-monospace, monospace'
    fontSize: '0.8rem'
    fontWeight: '500'
    lineHeight: '1.4'

rounded:
  DEFAULT: '0.5rem'
  sm: '0.375rem'
  md: '0.5rem'
  lg: '0.75rem'
  xl: '1rem'
  '2xl': '1.5rem'
  '3xl': '2rem'
  full: '9999px'

spacing:
  '0': '0'
  '1': '0.25rem'
  '2': '0.5rem'
  '3': '0.75rem'
  '4': '1rem'
  '5': '1.25rem'
  '6': '1.5rem'
  '8': '2rem'
  '10': '2.5rem'
  '12': '3rem'
  gutter: '1rem'
  section: '2rem'

components:
  icon-button:
    size: '2.5rem'
    rounded: '{rounded.full}'
    color: '{colors.ink-soft}'
    color-hover: '{colors.ink}'
    color-active: '{colors.primary}'
  icon-button-dark:
    size: '2.5rem'
    rounded: '{rounded.full}'
    color: '{colors.ink-soft-dark}'
    color-hover: '{colors.ink-dark}'
    color-active: '{colors.primary-dark}'
  toggle-track:
    light: '{colors.surface-soft}'
    dark: '{colors.surface-line-dark}'
  toggle-thumb:
    light: '{colors.ink}'
    dark: '{colors.ink-dark}'
  dualtone-icon:
    stroke: '{colors.ink}'
    stroke-dark: '{colors.ink-dark}'
    fill: '{colors.surface-base}'
    fill-dark: '{colors.surface-base-dark}'
    accent-stroke: '{colors.accent}'
    accent-stroke-dark: '{colors.accent-dark}'
  card:
    light: '{colors.surface-base}'
    light-ring: '{colors.surface-line}'
    dark: '{colors.surface-base-dark}'
    dark-ring: '{colors.surface-line-dark}'
  stat-card:
    icon-bg-light: '{colors.surface-soft}'
    icon-bg-dark: '{colors.surface-soft-dark}'
  primary-button:
    light: '{colors.primary}'
    light-hover: '{colors.primary-soft}'
    dark: '{colors.primary-dark}'
    dark-hover: '{colors.primary-soft-dark}'
  gradient-hero:
    light: 'linear-gradient(135deg, {colors.primary} 0%, {colors.primary-soft} 100%)'
    dark: 'linear-gradient(135deg, {colors.primary-dark} 0%, {colors.primary-soft-dark} 100%)'

# Dark mode is a single-token surface swap, not a separate design system.
# Every component above carries a `-dark` twin; the toggle flips the whole
# tree via a class on <html>, so no component is authored twice.