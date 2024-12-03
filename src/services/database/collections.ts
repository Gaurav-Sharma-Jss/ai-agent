export const COLLECTIONS = {
  USERS: 'users',
  AGENTS: 'agents',
  USER_COUNTS: 'userCounts',
  SETTINGS: 'settings'
} as const;

export const SYSTEM_DOCUMENTS = {
  USER_COUNT: 'userCount',
  SYSTEM_SETTINGS: 'systemSettings'
} as const;

export type CollectionName = keyof typeof COLLECTIONS;
export type SystemDocument = keyof typeof SYSTEM_DOCUMENTS;