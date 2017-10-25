import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthenticationResolverService implements Resolve<any> {

  constructor(private authenticationService: AuthenticationService) { }

  resolve(): Observable<boolean> {
    return this.authenticationService.resolveLoggedInStatus();
  }
}
