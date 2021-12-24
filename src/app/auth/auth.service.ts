import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _currentUserId: string | undefined;
  private logoutTimer: any;
  private token: string | undefined;
  private isAuthenticated$$ = new BehaviorSubject<boolean>(false);

  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticated$$.asObservable();
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticated$$.value;
  }

  get currentUserId(): string | undefined {
    return this._currentUserId;
  }

  constructor(private httpClient: HttpClient, private router: Router) {}

  getToken(): string | undefined {
    return this.token;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password,
    };
    this.httpClient
      .post<{ message: string; result: AuthData }>(
        'http://localhost:3000/api/user/signup',
        authData
      )
      .subscribe((response) => {
        console.log(response);
      });
  }

  login(email: string, password: string) {
    this.httpClient
      .post<{
        message: string;
        token: string;
        expiresIn: number;
        userId: string;
      }>('http://localhost:3000/api/user/login', {
        email: email,
        password: password,
      })
      .subscribe(
        (response: {
          message: string;
          token: string;
          expiresIn: number;
          userId: string;
        }) => {
          if (response.token) {
            const userId = response.userId;
            this._currentUserId = userId;
            this.token = response.token;
            this.setLogoutTimer(response.expiresIn);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + response.expiresIn * 1000
            );
            this.setAuthData(this.token, expirationDate, userId);
            this.isAuthenticated$$.next(true);
            this.router.navigate(['/']);
          }
        }
      );
  }

  autoAuth() {
    const authInformation = this.getAuthData();
    if (authInformation) {
      const expirationDate = authInformation.expirationDate;
      const now = new Date();
      const timeUntilExpiration = expirationDate.getTime() - now.getTime();

      if (timeUntilExpiration > 0) {
        this.setLogoutTimer(timeUntilExpiration / 1000);
        this.token = authInformation.token;
        this._currentUserId = authInformation.userId;
        this.isAuthenticated$$.next(true);
      }
    }
  }

  logout() {
    this.isAuthenticated$$.next(false);
    this.token = undefined;
    this._currentUserId = undefined;
    this.router.navigate(['/']);
    this.clearAuthData();
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
  }

  private setLogoutTimer(durationInSeconds: number) {
    this.logoutTimer = setTimeout(() => {
      this.logout();
    }, durationInSeconds * 1000);
  }

  private setAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private getAuthData():
    | { token: string; expirationDate: Date; userId: string }
    | undefined {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');

    if (token && expiration && userId) {
      return {
        token,
        expirationDate: new Date(expiration),
        userId,
      };
    }
    return;
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }
}
