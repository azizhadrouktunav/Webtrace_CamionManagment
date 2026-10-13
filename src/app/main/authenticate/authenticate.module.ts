import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth/auth.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { RecaptchaModule } from "ng-recaptcha";

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FuseDirectivesModule } from '@fuse/directives/directives';
import { FusePipesModule } from '@fuse/pipes/pipes.module';
import { AuthDialogComponent } from '../parc/Dialogs/auth-dialog/auth-dialog.component';

import { NgxPictureModule, CLOUDINARY_CONFIG } from 'ngx-picture';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { MatProgressSpinnerModule } from '@angular/material';

const routes = [
  {
      path: '', 
      component:  AuthComponent
  }
];

@NgModule({
  declarations: [AuthComponent , AuthDialogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    FuseDirectivesModule,
    FusePipesModule,
    NgxPictureModule.forRoot(CLOUDINARY_CONFIG),
    MatMomentDateModule,
    TranslateModule,
    RecaptchaModule,
    MatProgressButtonsModule,
    MatProgressSpinnerModule
  ],
  exports: [
    AuthComponent,
    RouterModule
  ],
  entryComponents: [
    AuthDialogComponent
  ],
 
})
export class AuthenticateModule { }
