import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}

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
      .post<{ message: string; token: any }>(
        'http://localhost:3000/api/user/login',
        {
          email: email,
          password: password,
        }
      )
      .subscribe((response: { message: string; token: string }) => {
        console.dir(response.token);
      });
  }
}
