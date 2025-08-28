import { User as SupabaseUser } from "@supabase/supabase-js";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  nickname: string;
  level: number;
  exp: number;
  age: number;
  gender: string;
  is_single: boolean;
  has_child: boolean;
  tags: string[];
}

export interface AuthState {
  user: SupabaseUser | null;
  session: unknown | null;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType {
  user: SupabaseUser | null;
  session: unknown | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
  resendVerificationEmail: (email: string) => Promise<boolean>;
  getUserProfile: () => Promise<UserProfile | null>;
  createUserProfile: (profileData: {
    nickname: string;
    age: number;
    gender: string;
    is_single: boolean;
    has_child: boolean;
    tags: string[];
  }) => Promise<UserProfile>;
}
