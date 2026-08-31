import type { RegisterOptions } from 'react-hook-form'

const MIN_PASSWORD_LENGTH = 6
const MAX_PASSWORD_LENGTH = 20
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const EMAIL_PATTERN_ERROR = 'The email must match the format example@example.com'
const PASSWORD_MIN_LENGTH_ERROR = 'Minimum number of characters 6'
const PASSWORD_MAX_LENGTH_ERROR = 'Maximum number of characters 20'

export const EMAIL_RULES = {
  validate: {
    pattern: (value: string) => !value || EMAIL_PATTERN.test(value) || EMAIL_PATTERN_ERROR,
  },
} satisfies RegisterOptions

export const PASSWORD_LENGTH_RULES = {
  validate: {
    minLength: (value: string) =>
      !value || value.length >= MIN_PASSWORD_LENGTH || PASSWORD_MIN_LENGTH_ERROR,
    maxLength: (value: string) =>
      !value || value.length <= MAX_PASSWORD_LENGTH || PASSWORD_MAX_LENGTH_ERROR,
  },
} satisfies RegisterOptions
