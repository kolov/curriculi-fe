import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from './components/about/about.component';
import { CompaniesComponent } from './components/companies/companies.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { AuthenticationResolverService } from './services/authentication/authentication-resolver.service';
import { AuthenticationGuard } from './services/authentication/authentication.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    resolve: {
      isLoggedIn: AuthenticationResolverService
    },
    children: [
      {
        path: 'about',
        component: AboutComponent
      },
      {
        path: 'companies',
        component: CompaniesComponent,
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'login',
        component: LoginComponent
      }
    ]
  }
];

export const AppRoutesModule = RouterModule.forRoot(routes);
