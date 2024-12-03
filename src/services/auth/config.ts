import { ActionCodeSettings } from 'firebase/auth';

export const AUTH_CONFIG = {
  RATE_LIMIT_DURATION: 60000, // 1 minute in milliseconds
  ACTION_CODE_SETTINGS: {
    url: `${window.location.origin}/verify-email`,
    handleCodeInApp: true
  } as ActionCodeSettings,
  ERROR_MESSAGES: {
    UNAUTHORIZED_CONTINUE_URI: 'Email verification is temporarily unavailable. Please try again later.',
    TOO_MANY_REQUESTS: 'Too many requests. Please try again in a few minutes.',
    EMAIL_IN_USE: 'An account with this email already exists.',
    INVALID_CREDENTIALS: 'Invalid email or password.',
    USER_NOT_FOUND: 'No account found with this email.',
    DEFAULT: 'An unexpected error occurred. Please try again.'
  }
};