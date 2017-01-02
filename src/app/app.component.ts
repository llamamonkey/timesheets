import { Component } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { LoginRegisterComponent } from './login-register/login-register.component';

@Component({
  selector: 'app-root',
  template: `
    <md-toolbar>Timesheets</md-toolbar>
    <app-login-register></app-login-register>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  constructor(private af: AngularFire) {
  }
}
