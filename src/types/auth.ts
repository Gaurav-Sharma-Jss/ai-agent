export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
  agentCount: number;
  lastLogin: Date;
  emailVerified: boolean;
  profileImage?: string;
  phoneNumber?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  bio?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}