import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AuthenticationService } from '../../services/authentication/authentication.service';
import { MenuComponent } from './menu.component';

describe('The menu component', () => {
  const isLoggedIn$ = new BehaviorSubject(null);

  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async(() => {
    const authenticationServiceStub = {
      getLoggedInStatus: () => isLoggedIn$
    };

    TestBed
      .configureTestingModule({
        declarations: [MenuComponent],
        imports: [RouterTestingModule],
        providers: [
          { provide: AuthenticationService, useValue: authenticationServiceStub }
        ]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
  });

  describe('when not logged in', () => {
    beforeEach(() => {
      isLoggedIn$.next(false);
      fixture.detectChanges();
    });

    it('shows a link to the login page', () => {
      const loginLink = fixture.debugElement.query(By.css('nav a[routerLink="/login"]'));

      expect(loginLink).toBeTruthy();
      expect(loginLink.nativeElement.innerText).toBe('Login');
    });

    it('does not show the logout button', () => {
      const logoutButton = fixture.debugElement.query(By.css('nav button'));

      expect(logoutButton).toBeFalsy();
    });
  });

  describe('when logged in', () => {
    beforeEach(() => {
      isLoggedIn$.next(true);
      fixture.detectChanges();
    });

    it('shows the logout button', () => {
      const logoutButton = fixture.debugElement.query(By.css('nav button'));

      expect(logoutButton).toBeTruthy();
      expect(logoutButton.nativeElement.innerText).toBe('Logout');
    });

    it('does not show a link to the login page', () => {
      const loginLink = fixture.debugElement.query(By.css('nav a[routerLink="/login"]'));

      expect(loginLink).toBeFalsy();
    });
  });
});
