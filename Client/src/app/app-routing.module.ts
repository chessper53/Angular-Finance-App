import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuardService } from './services/authcheck.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CockpitComponent } from './components/cockpit/cockpit.component';

const routes: Routes = [
  {path: "login", component : LoginComponent},
  {path: "register", component : RegisterComponent},
  {path: "dashboard", component : DashboardComponent, canActivate: [AuthGuardService]},
  {path: "cockpit", component : CockpitComponent, canActivate: [AuthGuardService]},
  {path: "", redirectTo: "/login", pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
