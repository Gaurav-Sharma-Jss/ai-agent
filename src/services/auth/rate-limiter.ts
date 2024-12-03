interface RateLimitEntry {
  timestamp: number;
  count: number;
}

const rateLimits = new Map<string, RateLimitEntry>();

export class RateLimiter {
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  canPerformAction(key: string): boolean {
    const now = Date.now();
    const entry = rateLimits.get(key);

    if (!entry) {
      rateLimits.set(key, { timestamp: now, count: 1 });
      return true;
    }

    if (now - entry.timestamp > this.windowMs) {
      rateLimits.set(key, { timestamp: now, count: 1 });
      return true;
    }

    if (entry.count >= this.maxAttempts) {
      return false;
    }

    entry.count += 1;
    return true;
  }

  getRemainingTime(key: string): number {
    const entry = rateLimits.get(key);
    if (!entry) return 0;

    const now = Date.now();
    const timeElapsed = now - entry.timestamp;
    return Math.max(0, this.windowMs - timeElapsed);
  }

  reset(key: string): void {
    rateLimits.delete(key);
  }
}

export const authRateLimiter = new RateLimiter(5, 60000); // 5 attempts per minute