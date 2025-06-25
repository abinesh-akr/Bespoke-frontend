import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChefHomeComponent } from './chef-home/chef-home.component';
import { ChefLoginComponent } from './chef-login/chef-login.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@NgModule({
  declarations: [
    ChefHomeComponent,
    ChefLoginComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    RouterLink
  ],
  exports: [
    ChefHomeComponent,
    ChefLoginComponent
  ]
})
export class ChefModule { }