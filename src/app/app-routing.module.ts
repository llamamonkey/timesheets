import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginRegisterComponent } from './login-register/login-register.component';
import { DayListComponent } from './day-list/day-list.component';

const routes: Routes = [
  {
    path: '',
    children: [],
    component: DayListComponent
  },
  {
    path: 'login',
    component: LoginRegisterComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
