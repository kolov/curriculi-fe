import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutesModule } from './app.routes';
import { AboutComponent } from './components/about/about.component';
import { CompaniesComponent } from './components/companies/companies.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { AuthenticationResolverService } from './services/authentication/authentication-resolver.service';
import { AuthenticationGuard } from './services/authentication/authentication.guard';
import { AuthenticationService } from './services/authentication/authentication.service';

@NgModule({
  declarations: [
    AboutComponent,
    AppComponent,
    CompaniesComponent,
    DashboardComponent,
    LoginComponent,
    MenuComponent
  ],
  imports: [
    AppRoutesModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthenticationGuard,
    AuthenticationService,
    AuthenticationResolverService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
