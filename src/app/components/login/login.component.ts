import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { InvalidUserTypeError } from '../../services/authentication/authentication';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'curri-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showError: boolean;
  errorMessage: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: [
        null,
        [Validators.required, Validators.email]
      ],
      password: [
        null,
        [Validators.required]
      ]
    });
  }

  login(): void {
    const { email, password } = this.loginForm.value;

    this.showError = false;

    this.authenticationService
      .login(email, password, 'ADMIN')
      .subscribe(
        () => {
          this.router.navigate(['']);
        },
        (response: HttpErrorResponse | InvalidUserTypeError) => {
          this.showError = true;

          if (response instanceof HttpErrorResponse) {
            if (response.error) {
              const attemptsRemaining = response.error.attemptsRemaining;

              this.errorMessage = 'The supplied credentials are invalid.';

              if (attemptsRemaining <= 3) {
                this.errorMessage += ` ${attemptsRemaining} attempt${attemptsRemaining > 1 ? 's' : ''} remaining.`;
              }
            } else {
              this.errorMessage = `${response.status} - ${response.statusText}`;
            }
          }

          if (response instanceof InvalidUserTypeError) {
            this.errorMessage = response.message;
          }
        }
      );
  }
}
