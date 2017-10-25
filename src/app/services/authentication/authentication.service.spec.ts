import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';

import { InvalidUserTypeError } from './authentication';
import { AuthenticationService } from './authentication.service';

describe('The AuthenticationService', () => {
  let authenticationService: AuthenticationService;

  let mockedCompaniesResponse = Observable.of({});
  let mockedLoginResponse: Observable<any>;
  const mockedLogoutResponse = Observable.of({});

  const httpClientStub = {
    get: () => mockedCompaniesResponse,
    post: () => mockedLoginResponse,
    delete: () => mockedLogoutResponse
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthenticationService,
        { provide: HttpClient, useValue: httpClientStub }
      ]
    });

    authenticationService = TestBed.get(AuthenticationService);
  });

  describe('has a setLoggedInStatus to determine if a user is still logged in from an earlier visit', () => {
    it('returns true for users with access to the API', (done) => {
      mockedCompaniesResponse = Observable.of({});

      authenticationService
        .resolveLoggedInStatus()
        .flatMap(() => authenticationService.getLoggedInStatus())
        .subscribe((isLoggedIn) => {
          expect(isLoggedIn).toBe(true);

          done();
        });
    });

    it(`returns false for users who don't have access to the API`, (done) => {
      mockedCompaniesResponse = Observable.throw({});

      authenticationService
        .resolveLoggedInStatus()
        .flatMap(() => authenticationService.getLoggedInStatus())
        .subscribe((isLoggedIn) => {
          expect(isLoggedIn).toBe(false);

          done();
        });
    });
  });

  describe('has a login method', () => {
    it('sets isLoggedIn to true when authentication succeeds', (done) => {
      mockedLoginResponse = Observable.of({
        userType: 'ADMIN'
      });

      authenticationService
        .login('henk@hotmail.com', 'password', 'ADMIN')
        .flatMap(() => authenticationService.getLoggedInStatus())
        .subscribe((isLoggedIn) => {
          expect(isLoggedIn).toBe(true);

          done();
        });
    });

    it('returns the error from httpClient if authentication fails', (done) => {
      mockedLoginResponse = Observable.throw('someHttpClientError');

      authenticationService
        .login('henk@hotmail.com', 'incorrectpassword', 'ADMIN')
        .subscribe(
          null,
          (error) => {
            expect(error).toBe('someHttpClientError');

            done();
          }
        );
    });

    it(`throws an InvalidUserTypeError when the userType doesn't match the expectedUserType`, (done) => {
      mockedLoginResponse = Observable.of({
        userType: 'NOT_AN_ADMIN'
      });

      spyOn(authenticationService, 'logout').and.callThrough();

      authenticationService
        .login('henk@hotmail.com', 'password', 'ADMIN')
        .subscribe(
          null,
          (error) => {
            expect(error instanceof InvalidUserTypeError).toBe(true);
            expect(error.message)
              .toBe('This application requires the ADMIN role. You have the NOT_AN_ADMIN role.');

            // This makes sure the user is logged out from the backend as well
            expect(authenticationService.logout).toHaveBeenCalled();

            done();
          }
        );
    });
  });

  it('has a logout method', (done) => {
    mockedLoginResponse = Observable.of({
      userType: 'ADMIN'
    });

    authenticationService
      .logout()
      .switchMap(() => authenticationService.getLoggedInStatus())
      .do((isLoggedIn) => {
        expect(isLoggedIn).toBe(false);

        done();
      })
      .subscribe();
  });
});
