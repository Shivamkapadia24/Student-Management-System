import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  private isLoggedInSubject = new BehaviorSubject<boolean>(!!this.getCollegeName());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor() {
    // Automatically clean up legacy token from previous versions
    localStorage.removeItem('auth_token');
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, userData).pipe(
      tap(res => {
        if (res.username) {
          localStorage.setItem('college_name', res.username);
        }
        this.isLoggedInSubject.next(true);
      })
    );
  }

  logout() {
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      next: () => {
        localStorage.removeItem('college_name');
        this.isLoggedInSubject.next(false);
      },
      error: (err) => {
        console.error('Logout request failed:', err);
        localStorage.removeItem('college_name');
        this.isLoggedInSubject.next(false);
      }
    });
  }

  getCollegeName(): string | null {
    return localStorage.getItem('college_name');
  }

  isLoggedIn(): boolean {
    return !!this.getCollegeName();
  }
}
