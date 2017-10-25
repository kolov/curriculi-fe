import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { companiesConfig } from '../companies/companies.config';
import { AuthenticationPayload, AuthenticationResponse, InvalidUserTypeError, userType } from './authentication';
import { authenticationConfig } from './authentication.config';

@Injectable()
export class AuthenticationService {
  private isLoggedInRequest$: Observable<true>;
  private isLoggedInValue$ = new BehaviorSubject(null);

  constructor(private httpClient: HttpClient) {}

  resolveLoggedInStatus(): Observable<boolean> {
    if (this.isLoggedInValue$.value) {
      return Observable.of(this.isLoggedInValue$.value);
    }

    if (!this.isLoggedInRequest$) {
      /**
       * The front end does not have access to the JWT. The only way to accurately check if a user is logged in is by
       * trying to retrieve content that requires users to be logged in...
       */
      this.isLoggedInRequest$ = this.httpClient
        .get(companiesConfig.queryUrl)
        .map(() => true)
        .catch(() => Observable.of(false))
        .do((isLoggedIn) => {
          this.isLoggedInValue$.next(isLoggedIn);
        });
    }

    return this.isLoggedInRequest$;
  }

  getLoggedInStatus(): BehaviorSubject<boolean> {
    return this.isLoggedInValue$;
  }

  login(email: string, password: string, expectedUserType: userType): Observable<AuthenticationResponse|HttpErrorResponse> {
    const payload: AuthenticationPayload = {
      username: email,
      password
    };

    return this.httpClient
      .post(authenticationConfig.loginUrl, payload)
      .do((authResponse: AuthenticationResponse) => {
        const isValidUserType = authResponse.userType === expectedUserType;

        if (!isValidUserType) {
          this.logout().subscribe();

          throw new InvalidUserTypeError(expectedUserType, authResponse.userType);
        }
      })
      .do(() => {
        this.isLoggedInValue$.next(true);
      });
  }

  logout(): Observable<Response> {
    return this.httpClient
      .delete(authenticationConfig.logoutUrl)
      .do(() => {
        this.isLoggedInValue$.next(false);
      });
  }
}
