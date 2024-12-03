export const AUTH_CONFIG = {
  CONTINUE_URL: `${window.location.origin}/auth/action`,
  PASSWORD_RESET_URL: `${window.location.origin}/auth/reset-password`,
  VERIFICATION_URL: `${window.location.origin}/auth/verify-email`,
  RATE_LIMIT_DURATION: 60000, // 1 minute
  ERROR_MESSAGES: {
    UNAUTHORIZED_CONTINUE_URI: 'Email verification is temporarily unavailable. Please try again later.',
    TOO_MANY_REQUESTS: 'Too many requests. Please try again in a few minutes.',
    EMAIL_IN_USE: 'An account with this email already exists.',
    INVALID_CREDENTIALS: 'Invalid email or password.',
    USER_NOT_FOUND: 'No account found with this email.',
    DEFAULT: 'An unexpected error occurred. Please try again.'
  }
};