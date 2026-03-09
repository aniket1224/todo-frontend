import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `https://todo-backend-xnyx.onrender.com/auth`;
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  signup(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, { email, password }).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('userId', response.userId);
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('userId', response.userId);
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  logout(): void {
    const token = this.getToken();
    if (token) {
      this.http.post(`${this.apiUrl}/logout`, {}, {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      }).subscribe(
        () => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
          this.isAuthenticatedSubject.next(false);
          this.router.navigate(['/login']);
        },
        (error) => {
          // Clear local storage even if logout request fails
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
          this.isAuthenticatedSubject.next(false);
          console.error('Logout error:', error);
          this.router.navigate(['/login']);
        }
      );
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      this.isAuthenticatedSubject.next(false);
      this.router.navigate(['/login']);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }
}
