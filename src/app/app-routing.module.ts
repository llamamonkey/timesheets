import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginRegisterComponent } from './login-register/login-register.component';
import { DayListComponent } from './day-list/day-list.component';
import { AccountPageComponent } from './account-page/account-page.component';

const routes: Routes = [
  {
    path: 'home',
    children: [],
    component: DayListComponent
  },
  {
    path: 'login',
    component: LoginRegisterComponent
  },
  {
    path: 'account',
    component: AccountPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
