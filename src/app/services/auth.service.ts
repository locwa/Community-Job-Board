import { Injectable, inject, signal } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);
  
  currentUser = signal<User | null>(null);
  isLoggedIn = signal(false);
  authError = signal<string | null>(null);
  loading = signal(false);

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser.set(user);
      this.isLoggedIn.set(!!user);
    });
  }

  async login(email: string, password: string): Promise<boolean> {
    this.loading.set(true);
    this.authError.set(null);
    
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      this.clearError();
      this.router.navigate(['/']);
      return true;
    } catch (error: any) {
      this.authError.set(this.getErrorMessage(error.code));
      return false;
    } finally {
      this.loading.set(false);
    }
  }

  async register(email: string, password: string): Promise<boolean> {
    this.loading.set(true);
    this.authError.set(null);
    
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
      this.clearError();
      this.router.navigate(['/']);
      return true;
    } catch (error: any) {
      this.authError.set(this.getErrorMessage(error.code));
      return false;
    } finally {
      this.loading.set(false);
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.clearError();
      this.router.navigate(['/login']);
    } catch (error: any) {
      this.authError.set(this.getErrorMessage(error.code));
    }
  }

  clearError(): void {
    this.authError.set(null);
  }

  private getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/invalid-credential':
        return 'Invalid email or password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      default:
        return 'An error occurred. Please try again.';
    }
  }
}
