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

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, userData).pipe(
      tap(res => {
        if (res.token) {
          localStorage.setItem('auth_token', res.token);
          if (res.username) {
            localStorage.setItem('college_name', res.username);
          }
          this.isLoggedInSubject.next(true);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('college_name');
    this.isLoggedInSubject.next(false);
  }

  getCollegeName(): string | null {
    return localStorage.getItem('college_name');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}
