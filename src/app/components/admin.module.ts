import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminNavbarComponent } from './admin-navbar/admin-navbar.component';
import { AdminAddFoodComponent } from './admin-add-food/admin-add-food.component';
import { AdminAddChefComponent } from './admin-add-chef/admin-add-chef.component';
import { AdminViewHistoryComponent } from './admin-view-history/admin-view-history.component';
import { AdminModifyFoodsComponent } from './admin-modify-foods/admin-modify-foods.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

@NgModule({
  declarations: [
    AdminNavbarComponent,
    AdminAddFoodComponent,
    AdminAddChefComponent,
    AdminViewHistoryComponent,
    AdminModifyFoodsComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatSnackBarModule,
    MatToolbarModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    RouterLinkActive
  ],
  exports: [
    AdminNavbarComponent,
    AdminAddFoodComponent,
    AdminAddChefComponent,
    AdminViewHistoryComponent,
    AdminModifyFoodsComponent
  ]
})
export class AdminModule { }