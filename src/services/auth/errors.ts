export class AuthError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export function handleAuthError(error: any): AuthError {
  console.error('Auth error:', error);
  
  if (error instanceof AuthError) {
    return error;
  }

  const code = error.code || 'auth/unknown';
  const message = error.message || 'An unexpected error occurred';
  
  return new AuthError(message, code);
}