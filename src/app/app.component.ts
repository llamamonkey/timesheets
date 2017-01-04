import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFire } from 'angularfire2';

@Component({
  selector: 'app-root',
  template: `
    <md-toolbar>Timesheets</md-toolbar>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  constructor(private af: AngularFire, private router: Router) {
    this.af.auth.subscribe((auth) => {
      if (auth == null){
        this.router.navigate(['login']);
      }
    });
  }
}
