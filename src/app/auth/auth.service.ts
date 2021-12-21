import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string | undefined;
  private isAuthenticated$$ = new BehaviorSubject<boolean>(false);

  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticated$$.asObservable();
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
      .post<{ message: string; token: string }>(
        'http://localhost:3000/api/user/login',
        {
          email: email,
          password: password,
        }
      )
      .subscribe((response: { message: string; token: string }) => {
        if (response.token) {
          this.token = response.token;
          this.isAuthenticated$$.next(true);
          this.router.navigate(['/']);
        }
      });
  }

  logout() {
    this.isAuthenticated$$.next(false);
    this.token = undefined;
    this.router.navigate(['/']);
  }
}
