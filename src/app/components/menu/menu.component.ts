import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'curri-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  isLoggedIn$: BehaviorSubject<boolean>;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.isLoggedIn$ = this.authenticationService.getLoggedInStatus();
  }

  logout(): void {
    this.authenticationService.logout().subscribe(() => {
      this.router.navigate(['']);
    });
  }
}
