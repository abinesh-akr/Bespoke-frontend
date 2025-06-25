import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatListModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  foodId = '';
  foodName = '';
  foodPrice: number | null = null;
  userId = '';
  userName = '';
  userEmail = '';
  userLoyaltyPoints: number | null = null;
  chefId = '';
  chefName = '';
  chefImage = '';
  chefSpecialty = '';
  orders: any[] = [];
 
  constructor(private adminService: AdminService, private snackBar: MatSnackBar) {}

  updateFood() {
    if (this.foodId && this.foodName && this.foodPrice !== null) {
      this.adminService.updateFood(this.foodId, { name: this.foodName, price: this.foodPrice }).subscribe({
        next: () => this.snackBar.open('Food updated successfully', 'Close', { duration: 3000 }),
        error: (err:ErrorEvent) => this.snackBar.open('Error updating food: ' + err.error.msg, 'Close', { duration: 3000 })
      });
    } else {
      this.snackBar.open('Please fill in all food fields', 'Close', { duration: 3000 });
    }
  }

  deleteFood() {
    if (this.foodId) {
      this.adminService.deleteFood(this.foodId).subscribe({
        next: () => this.snackBar.open('Food deleted successfully', 'Close', { duration: 3000 }),
        error: (err:ErrorEvent) => this.snackBar.open('Error deleting food: ' + err.error.msg, 'Close', { duration: 3000 })
      });
    } else {
      this.snackBar.open('Please provide a food ID', 'Close', { duration: 3000 });
    }
  }

  updateUser() {
    if (this.userId && this.userName && this.userEmail && this.userLoyaltyPoints !== null) {
      this.adminService.updateUser(this.userId, {
        name: this.userName,
        email: this.userEmail,
        loyaltyPoints: this.userLoyaltyPoints
      }).subscribe({
        next: () => this.snackBar.open('User updated successfully', 'Close', { duration: 3000 }),
        error: (err:ErrorEvent) => this.snackBar.open('Error updating user: ' + err.error.msg, 'Close', { duration: 3000 })
      });
    } else {
      this.snackBar.open('Please fill in all user fields', 'Close', { duration: 3000 });
    }
  }

  deleteUser() {
    if (this.userId) {
      this.adminService.deleteUser(this.userId).subscribe({
        next: () => this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 }),
        error: (err:ErrorEvent) => this.snackBar.open('Error deleting user: ' + err.error.msg, 'Close', { duration: 3000 })
      });
    } else {
      this.snackBar.open('Please provide a user ID', 'Close', { duration: 3000 });
    }
  }

  viewOrders() {
    this.adminService.getAllOrders().subscribe({
      next: (orders:any[]) => {
        this.orders = orders;
        this.snackBar.open('Orders loaded successfully', 'Close', { duration: 3000 });
      },
      error: (err:ErrorEvent) => this.snackBar.open('Error loading orders: ' + err.error.msg, 'Close', { duration: 3000 })
    });
  }

  addChef() {
    if (this.chefName && this.chefImage && this.chefSpecialty) {
      this.adminService.addChef({ name: this.chefName, image: this.chefImage, specialty: this.chefSpecialty }).subscribe({
        next: () => this.snackBar.open('Chef added successfully', 'Close', { duration: 3000 }),
        error: (err:ErrorEvent) => this.snackBar.open('Error adding chef: ' + err.error.msg, 'Close', { duration: 3000 })
      });
    } else {
      this.snackBar.open('Please fill in all chef fields', 'Close', { duration: 3000 });
    }
  }

  deleteChef() {
    if (this.chefId) {
      this.adminService.deleteChef(this.chefId).subscribe({
        next: () => this.snackBar.open('Chef deleted successfully', 'Close', { duration: 3000 }),
        error: (err:ErrorEvent) => this.snackBar.open('Error deleting chef: ' + err.error.msg, 'Close', { duration: 3000 })
      });
    } else {
      this.snackBar.open('Please provide a chef ID', 'Close', { duration: 3000 });
    }
  }
}