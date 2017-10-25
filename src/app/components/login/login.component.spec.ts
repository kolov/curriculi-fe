import { HttpErrorResponse } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/throw';

import { InvalidUserTypeError } from '../../services/authentication/authentication';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { LoginComponent } from './login.component';

describe('The login component', () => {
  let fixture: ComponentFixture<LoginComponent>,

    // Stubs
    authenticationStub,
    routerStub,

    // Debug elements
    form,
    emailField,
    passwordField,
    loginButton;

  beforeEach(async(() => {
    authenticationStub = {
      login: jasmine.createSpy('login')
    };

    routerStub = {
      navigate: jasmine.createSpy('navigate')
    };

    TestBed
      .configureTestingModule({
        declarations: [LoginComponent],
        imports: [
          ReactiveFormsModule
        ],
        providers: [
          { provide: AuthenticationService, useValue: authenticationStub },
          { provide: Router, useValue: routerStub }
        ]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();

    form = fixture.debugElement.query(By.css('form'));
    emailField = fixture.debugElement.query(By.css('input[type="email"]'));
    passwordField = fixture.debugElement.query(By.css('input[type="password"]'));
    loginButton = fixture.debugElement.query(By.css('button'));
  });

  function setInputValue(inputField: DebugElement, value: string) {
    // Set the value
    inputField.nativeElement.value = value;

    // Mark the field as 'touched'
    inputField.nativeElement.dispatchEvent(new Event('blur'));

    // Trigger valueChanges
    inputField.nativeElement.dispatchEvent(new Event('input'));

    // And update our fixture
    fixture.detectChanges();
  }

  describe('has form validation', () => {
    it('requires both email and password', () => {
      const requiredErrorMessage = 'This field is required.';

      // No required error messages are shown when showing the form for the first time
      expect(fixture.debugElement.nativeElement.innerText).not.toContain(requiredErrorMessage);

      // Enter some text in both fields
      setInputValue(emailField, 'henk');
      setInputValue(passwordField, 'password');

      // Then remove the input
      setInputValue(emailField, '');
      setInputValue(passwordField, '');

      // Then the required error messages appear
      const emailErrors = fixture.debugElement.queryAll(By.css('ul'))[0];
      const passwordErrors = fixture.debugElement.queryAll(By.css('ul'))[1];

      expect(emailErrors.nativeElement.innerText).toContain(requiredErrorMessage);
      expect(passwordErrors.nativeElement.innerText).toContain(requiredErrorMessage);
    });

    it('makes sure that an actual email adress is used', () => {
      const emailErrorMessage = 'This is not a valid e-mail address.';

      // No email error message is shown when showing the form for the first time
      expect(fixture.debugElement.nativeElement.innerText).not.toContain(emailErrorMessage);

      // Enter something that's not an e-mail address and an error message appears
      setInputValue(emailField, 'henk');
      expect(fixture.debugElement.nativeElement.innerText).toContain(emailErrorMessage);

      // Change it into an e-mail address and the error message will go away
      setInputValue(emailField, 'henk@hotmail.com');
      expect(fixture.debugElement.nativeElement.innerText).not.toContain(emailErrorMessage);
    });

    it('disables the login button if the form is invalid', () => {
      // By default the form is invalid and the button is disabled
      expect(loginButton.nativeElement.disabled).toBe(true);

      // Enter all data correctly
      setInputValue(emailField, 'henk@hotmail.com');
      setInputValue(passwordField, 'password');

      // Now the form is valid and the button will be enabled
      expect(loginButton.nativeElement.disabled).toBe(false);
    });
  });

  it('redirects to the homepage after a successful login', async(() => {
    authenticationStub.login.and.returnValue(Observable.of(null));

    setInputValue(emailField, 'henk@hotmail.com');
    setInputValue(passwordField, 'password');

    // Submit the form
    form.nativeElement.dispatchEvent(new Event('submit'));

    expect(routerStub.navigate).toHaveBeenCalledWith(['']);
  }));

  describe('has authentication errors for', () => {
    beforeEach(() => {
      setInputValue(emailField, 'henk@hotmail.com');
      setInputValue(passwordField, 'password');
    });

    it('invalid credentials', async(() => {
      const mockedHttpError = new HttpErrorResponse({
        error: {
          attemptsRemaining: 3
        }
      });

      authenticationStub.login.and.returnValue(Observable.throw(mockedHttpError));

      // Submit the form
      form.nativeElement.dispatchEvent(new Event('submit'));
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('[role="alert"]')).nativeElement.innerText)
        .toContain('The supplied credentials are invalid. 3 attempts remaining.');
    }));

    it('any kind of server error', () => {
      const mockedHttpError = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal server error'
      });

      authenticationStub.login.and.returnValue(Observable.throw(mockedHttpError));

      // Submit the form
      form.nativeElement.dispatchEvent(new Event('submit'));
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('[role="alert"]')).nativeElement.innerText)
        .toBe('500 - Internal server error');
    });

    it(`invalid userType (only users with the 'ADMIN' role get access`, () => {
      const mockedHttpError = new InvalidUserTypeError('ADMIN', 'curri-CUSTOMER');

      authenticationStub.login.and.returnValue(Observable.throw(mockedHttpError));

      // Submit the form
      form.nativeElement.dispatchEvent(new Event('submit'));
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('[role="alert"]')).nativeElement.innerText)
        .toBe('This application requires the ADMIN role. You have the curri-CUSTOMER role.');
    });
  });
});
