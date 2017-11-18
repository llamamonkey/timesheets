import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar>Timesheets 
        <div class="profileIcon" [hidden]="!loggedIn">
            <i class="material-icons right pointer" (click)="logout()">exit_to_app</i>
            <i class="material-icons right pointer" routerLink="/account">account_circle</i>
        </div>
    </mat-toolbar>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {

  private loggedIn: boolean = false

  constructor(private userService: UserService, private afAuth: AngularFireAuth, private router: Router) {
    this.afAuth.authState.subscribe((auth) => {
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
    this.afAuth.auth.signOut();
  }
}
