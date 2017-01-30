import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFire } from 'angularfire2';

@Component({
  selector: 'app-root',
  template: `
    <md-toolbar>Timesheets 
        <div class="profileIcon" [hidden]="!user">
            <i class="material-icons right pointer" (click)="logout()">exit_to_app</i>
            <i class="material-icons right pointer" routerLink="/account">account_circle</i>
        </div>
    </md-toolbar>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  private user: firebase.User = null;
  constructor(private af: AngularFire, private router: Router) {
    this.af.auth.subscribe((auth) => {
      if (auth == null){
        this.router.navigate(['login']);
      }
      this.user = auth.auth;
    });
  }

  logout(){
    this.af.auth.logout();
  }
}
