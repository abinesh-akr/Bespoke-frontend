import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

interface Food {
  _id: string;
  name: string;
  image: string | null; // Base64 string or null
}

interface Chef {
  _id: string;
  name: string;
  image: string | null; // Base64 string or null
}

interface User {
  _id: string;
  name: string;
  email: string;
}

interface OrderItem {
  food: Food;
  quantity: number;
}

interface Order {
  _id: string;
  total: number;
  status: string;
  user: User;
  chef: Chef;
  items: OrderItem[];
}

@Component({
  selector: 'app-admin-view-history',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatListModule],
  templateUrl: './admin-view-history.component.html',
  styleUrls: ['./admin-view-history.component.scss']
})
export class AdminViewHistoryComponent implements OnInit {
  orders: Order[] = [];
  ordersLoaded = false;

  constructor(private adminService: AdminService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.adminService.getAllOrders().subscribe({
      next: (orders: Order[]) => {
        console.log(orders);
        this.orders = orders;
        this.ordersLoaded = true;
        this.snackBar.open('Orders loaded successfully', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.snackBar.open('Error loading orders: ' + (err.error?.msg || 'Unknown error'), 'Close', { duration: 3000 });
      }
    });
  }
}