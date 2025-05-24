import { User } from '@shared/schema';

interface AuthTokens {
  token: string;
  user: User;
}

export class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private user: User | null = null;

  private constructor() {
    // Load token and user from localStorage on initialization
    this.loadFromStorage();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        this.token = token;
        this.user = JSON.parse(userStr);
      }
    }
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      if (this.token && this.user) {
        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }

  setAuth(authData: AuthTokens): void {
    this.token = authData.token;
    this.user = authData.user;
    this.saveToStorage();
  }

  clearAuth(): void {
    this.token = null;
    this.user = null;
    this.saveToStorage();
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return this.token !== null && this.user !== null;
  }

  getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    return headers;
  }
}

export const authService = AuthService.getInstance();
