import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService, User } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private apiService: ApiService) {
    // Check if user is logged in from localStorage
    this.checkStoredUser();
  }

  private checkStoredUser(): void {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          this.currentUserSubject.next(user);
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('currentUser');
        }
      }
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  private loadCurrentUser(): void {
    this.apiService.getCurrentUser().subscribe({
      next: (user: User) => {
        this.currentUserSubject.next(user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
      },
      error: (error) => {
        console.error('Error loading current user:', error);
        this.logout();
      }
    });
  }

  login(email: string, password: string): Observable<boolean> {
    return new Observable(observer => {
      this.apiService.login({ email, password }).subscribe({
        next: (response: any) => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            // Load current user and wait for it to complete
            this.apiService.getCurrentUser().subscribe({
              next: (user: User) => {
                this.currentUserSubject.next(user);
                if (typeof window !== 'undefined') {
                  localStorage.setItem('currentUser', JSON.stringify(user));
                }
                observer.next(true);
                observer.complete();
              },
              error: (error) => {
                console.error('Error loading current user:', error);
                observer.next(false);
                observer.complete();
              }
            });
          } else {
            observer.next(false);
            observer.complete();
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          observer.next(false);
          observer.complete();
        }
      });
    });
  }

  register(userData: any): Observable<boolean> {
    return new Observable(observer => {
      this.apiService.register({
        name: userData.name,
        email: userData.email,
        password: userData.password
      }).subscribe({
        next: (response: any) => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            // Load current user and wait for it to complete
            this.apiService.getCurrentUser().subscribe({
              next: (user: User) => {
                this.currentUserSubject.next(user);
                if (typeof window !== 'undefined') {
                  localStorage.setItem('currentUser', JSON.stringify(user));
                }
                observer.next(true);
                observer.complete();
              },
              error: (error) => {
                console.error('Error loading current user:', error);
                observer.next(false);
                observer.complete();
              }
            });
          } else {
            observer.next(false);
            observer.complete();
          }
        },
        error: (error) => {
          console.error('Registration error:', error);
          observer.next(false);
          observer.complete();
        }
      });
    });
  }

  logout(): void {
    this.currentUserSubject.next(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
    }
  }

  updateUserPoints(points: number): void {
    const currentUser = this.currentUserSubject.value;
    if (currentUser) {
      const updatedUser = { ...currentUser, points };
      this.currentUserSubject.next(updatedUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
    }
  }
}
