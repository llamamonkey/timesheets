import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { MaterialModule } from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import 'hammerjs';

import {appConfig} from './app.config';
import { AppComponent } from './app.component';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { DayListComponent } from './day-list/day-list.component';
import { KeysPipe } from './keys.pipe';
import { AddDialogComponent } from './dialogs/add-dialog/add-dialog.component';
import { EditDialogComponent } from './dialogs/edit-dialog/edit-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete-dialog/delete-dialog.component';
import { AccountPageComponent } from './account-page/account-page.component';

import { UserService } from './user.service';
import {ExcelService} from "./excel.service";
import { FilenameDialogComponent } from './dialogs/filename-dialog/filename-dialog.component';

export const firebaseConfig = {
  apiKey: appConfig.apiKey,
  authDomain: appConfig.authDomain,
  databaseURL: appConfig.databaseURL,
  storageBucket: appConfig.storageBucket,
  messagingSenderId: appConfig.messagingSenderId
};

const firebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
};

@NgModule({
  declarations: [
    AppComponent,
    LoginRegisterComponent,
    DayListComponent,
    KeysPipe,
    AddDialogComponent,
    EditDialogComponent,
    DeleteDialogComponent,
    AccountPageComponent,
    FilenameDialogComponent
  ],
  entryComponents: [
    AddDialogComponent,
    EditDialogComponent,
    DeleteDialogComponent,
    FilenameDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig),
    BrowserAnimationsModule,
    MaterialModule.forRoot()
  ],
  providers: [
      UserService,
      ExcelService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
