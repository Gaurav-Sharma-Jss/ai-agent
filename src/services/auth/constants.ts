export const AUTH_ROUTES = {
  VERIFY_EMAIL: '/verify-email',
  SIGN_IN: '/signin',
  SIGN_UP: '/signup',
  RESET_PASSWORD: '/reset-password'
} as const;

export const AUTH_ERRORS = {
  RATE_LIMIT: 'auth/rate-limited',
  UNAUTHORIZED_URI: 'auth/unauthorized-continue-uri',
  TOO_MANY_REQUESTS: 'auth/too-many-requests',
  EMAIL_IN_USE: 'auth/email-already-in-use',
  INVALID_CREDENTIAL: 'auth/invalid-credential',
  USER_NOT_FOUND: 'auth/user-not-found'
} as const;

export const AUTH_MESSAGES = {
  VERIFICATION_SENT: 'Verification email sent. Please check your inbox.',
  VERIFICATION_ERROR: 'Failed to send verification email.',
  RATE_LIMIT_BASE: 'Please wait {seconds} seconds before requesting another verification email',
  SIGNUP_SUCCESS: 'Account created successfully! Please check your email for verification.',
  SIGNIN_SUCCESS: 'Welcome back!',
  SIGNOUT_SUCCESS: 'Successfully signed out.',
  PASSWORD_RESET_SENT: 'Password reset instructions have been sent to your email.'
} as const;