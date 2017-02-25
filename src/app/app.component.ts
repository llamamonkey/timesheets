import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFire } from 'angularfire2';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  template: `
    <md-toolbar>Timesheets 
        <div class="profileIcon" [hidden]="!loggedIn">
            <i class="material-icons right pointer" (click)="logout()">exit_to_app</i>
            <i class="material-icons right pointer" routerLink="/account">account_circle</i>
        </div>
    </md-toolbar>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {

  private loggedIn: boolean = false

  constructor(private userService: UserService, private af: AngularFire, private router: Router) {
    this.af.auth.subscribe((auth) => {
      if (auth == null){
        this.router.navigate(['login']);
        this.loggedIn = false;
      } else {
        this.router.navigate(['home']);
        this.loggedIn = true;
      }
      this.userService.setUser(auth);
    });
  }

  logout(){
    this.af.auth.logout();
  }
}
