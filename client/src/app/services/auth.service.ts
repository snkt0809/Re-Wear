import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  points: number;
  memberSince: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
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

  login(email: string, password: string): Observable<boolean> {
    // Mock login - in real app, this would make an API call
    return new Observable(observer => {
      setTimeout(() => {
        // Simulate successful login
        const mockUser: User = {
          id: 1,
          name: 'Sarah Johnson',
          email: email,
          points: 1250,
          memberSince: new Date('2023-01-15')
        };

        this.currentUserSubject.next(mockUser);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentUser', JSON.stringify(mockUser));
        }
        
        observer.next(true);
        observer.complete();
      }, 1000); // Simulate network delay
    });
  }

  register(userData: any): Observable<boolean> {
    // Mock registration - in real app, this would make an API call
    return new Observable(observer => {
      setTimeout(() => {
        // Simulate successful registration
        const mockUser: User = {
          id: 2,
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          points: 100, // Starting points
          memberSince: new Date()
        };

        this.currentUserSubject.next(mockUser);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentUser', JSON.stringify(mockUser));
        }
        
        observer.next(true);
        observer.complete();
      }, 1000); // Simulate network delay
    });
  }

  logout(): void {
    this.currentUserSubject.next(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
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
