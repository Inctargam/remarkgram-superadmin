import type { RegisterOptions } from 'react-hook-form'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const EMAIL_PATTERN_ERROR = 'The email must match the format example@example.com'

export const EMAIL_RULES = {
  validate: {
    pattern: (value: string) => !value || EMAIL_PATTERN.test(value) || EMAIL_PATTERN_ERROR,
  },
} satisfies RegisterOptions
